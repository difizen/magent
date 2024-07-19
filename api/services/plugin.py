from datetime import datetime
from typing import List
from sqlalchemy.orm import Session
from yaml import safe_load
import re
import uuid

from dao.plugin import PluginAPIHelper, PluginConfigHelper, PluginHelper
from models.plugin import PluginCreate, PluginModel, PluginUpdate
from models.plugin_api import PluginApiCreate, PluginApiModel, PluginApiUpdate
from models.plugin_config import PluginConfigCreate, PluginConfigModel, PluginConfigUpdate


class PluginService:

    @staticmethod
    async def count(session: Session) -> int:
        cnt = PluginHelper.count(session)
        return cnt

    @staticmethod
    def create(operator: int, plugin_model: PluginCreate, session: Session) -> PluginModel:
        plugin_orm = PluginHelper.create(session, operator, plugin_model)
        return PluginModel.model_validate(plugin_orm)

    @staticmethod
    def update(operator: int, plugin_model: PluginUpdate, session: Session) -> int:
        res = PluginHelper.update(session, operator, plugin_model)
        return res

    @staticmethod
    def get_by_id(plugin_id: int, session: Session) -> PluginModel | None:
        plugin_orm = PluginHelper.get(session, plugin_id)
        if plugin_orm is None:
            return None
        else:
            return PluginModel.model_validate(plugin_orm)

    @staticmethod
    def get_all(session: Session) -> List[PluginModel]:
        plugin_orms = PluginHelper.get_all_plugin(session)
        print('plugin_orms', plugin_orms)
        return [PluginModel.model_validate(plugin_orm) for plugin_orm in plugin_orms]

    @staticmethod
    def get_user_plugin(user_id: int, session: Session) -> List[PluginModel]:
        plugin_orms = PluginHelper.get_user_plugin(session, user_id)
        return [PluginModel.model_validate(plugin_orm) for plugin_orm in plugin_orms]


class PluginConfigService:

    @staticmethod
    def get_by_id(config_id: int, session: Session) -> PluginConfigModel | None:
        plugin_config_orm = PluginConfigHelper.get(session, config_id)
        if plugin_config_orm is None:
            return None
        else:
            return PluginConfigModel.model_validate(plugin_config_orm)

    @staticmethod
    def get_plugin_draft(plugin_id: int, session: Session) -> PluginConfigModel | None:
        plugin_config_orm = PluginConfigHelper.get_plugin_draft(
            session, plugin_id)
        if plugin_config_orm is None:
            return None
        else:
            return PluginConfigModel.model_validate(plugin_config_orm)

    @staticmethod
    def get_latest_publish_config(plugin_id: int, session: Session) -> PluginConfigModel | None:
        plugin_config_orm = PluginConfigHelper.get_latest_publish_config(
            session, plugin_id)
        if plugin_config_orm is None:
            return None
        else:
            return PluginConfigModel.model_validate(plugin_config_orm)

    @staticmethod
    def get_or_create_plugin_draft(operator: int, plugin_id: int, session: Session) -> PluginConfigModel:
        exist = PluginConfigHelper.get_or_create_plugin_draft(
            session, operator, plugin_id)
        return exist

    @staticmethod
    def create(operator: int, config_model: PluginConfigCreate, session: Session) -> PluginConfigModel:
        plugin_config_orm = PluginConfigHelper.create(
            session, operator, config_model)
        return PluginConfigModel.model_validate(plugin_config_orm)

    @staticmethod
    def update(operator: int, config_model: PluginConfigUpdate, session: Session) -> int:
        if config_model.plugin_openapi_desc is not None:
            print('config_model.plugin_openapi_desc',
                  config_model.plugin_openapi_desc)
            plugin_api_bundles = PluginAPIService.parse_openapi_yaml_to_plugin_api_bundle(
                config_model.id, config_model.plugin_openapi_desc, operator)
            for plugin_api in plugin_api_bundles:
                PluginAPIService.create(operator, plugin_api, session)
            print('tool_bundles', plugin_api_bundles)
        res = PluginConfigHelper.update(
            session, operator, config_model)
        return res


class PluginAPIService:
    @staticmethod
    async def count(session: Session) -> int:
        cnt = PluginAPIHelper.count(session)
        return cnt

    @staticmethod
    def get_by_id(plugin_api_id: int, session: Session) -> PluginApiModel | None:
        plugin_api_orm = PluginAPIHelper.get(session, plugin_api_id)
        if plugin_api_orm is None:
            return None
        else:
            return PluginApiModel.model_validate(plugin_api_orm)

    @staticmethod
    def get_by_config_id(plugin_config_id: int, session: Session) -> List[PluginApiModel]:
        plugin_api_orms = PluginAPIHelper.get_by_config_id(
            session, plugin_config_id)
        return [PluginApiModel.model_validate(plugin_api_orm) for plugin_api_orm in plugin_api_orms]

    @staticmethod
    def get_all(session: Session) -> List[PluginApiModel]:
        plugin_api_orms = PluginAPIHelper.get_all(session)
        return [PluginApiModel.model_validate(plugin_api_orm) for plugin_api_orm in plugin_api_orms]

    @staticmethod
    def update(operator: int, plugin_api_model: PluginApiUpdate, session: Session) -> int:

        res = PluginAPIHelper.update(
            session, operator, plugin_api_model)
        return res

    @staticmethod
    def create(operator: int, plugin_api_model: PluginApiCreate, session: Session) -> PluginApiModel:
        plugin_api_orm = PluginAPIHelper.create(
            session, operator, plugin_api_model)
        return PluginApiModel.model_validate(plugin_api_orm)

    @staticmethod
    def parse_openapi_yaml_to_plugin_api_bundle(plugin_config_id: int, yaml: str, operator: int, extra_info: dict | None = None) -> list[PluginApiCreate]:
        """
            parse openapi yaml to tool bundle

            :param yaml: the yaml string
            :return: the tool bundle
        """
        extra_info = extra_info if extra_info is not None else {}

        openapi: dict = safe_load(yaml)
        if openapi is None:
            raise Exception('Invalid openapi yaml.')

        extra_info = extra_info if extra_info is not None else {}
        now = datetime.now()

        # set description to extra_info
        extra_info['description'] = openapi['info'].get('description', '')

        if len(openapi['servers']) == 0:
            raise Exception('No server found in the openapi yaml.')

        server_url = str(openapi['servers'][0]['url'])

        # list all interfaces
        interfaces = []
        for path, path_item in openapi['paths'].items():
            methods = ['get', 'post', 'put', 'delete',
                       'patch', 'head', 'options', 'trace']
            for method in methods:
                if method in path_item:
                    interfaces.append({
                        'path': path,
                        'method': method,
                        'operation': path_item[method],
                    })

        # get all parameters
        bundles = []
        for interface in interfaces:
            # convert parameters
            parameters = []
            if 'parameters' in interface['operation']:
                for parameter in interface['operation']['parameters']:
                    parameters.append(parameter)
            # create tool bundle
            # check if there is a request body
            if 'requestBody' in interface['operation']:
                request_body = interface['operation']['requestBody']
                if 'content' in request_body:
                    for content_type, content in request_body['content'].items():
                        # if there is a reference, get the reference and overwrite the content
                        if 'schema' not in content:
                            continue

                        if '$ref' in content['schema']:
                            # get the reference
                            root = openapi
                            reference = content['schema']['$ref'].split(
                                '/')[1:]
                            for ref in reference:
                                root = root[ref]
                            # overwrite the content
                            interface['operation']['requestBody']['content'][content_type]['schema'] = root

                    # parse body parameters
                    if 'schema' in interface['operation']['requestBody']['content'][content_type]:
                        body_schema = interface['operation']['requestBody']['content'][content_type]['schema']
                        required = body_schema.get('required', [])
                        properties = body_schema.get('properties', {})
                        print('properties', properties)
                        # for name, property in properties.items():
                        # tool = ToolParameter(
                        #     name=name,
                        #     label=I18nObject(
                        #         en_US=name,
                        #         zh_Hans=name
                        #     ),
                        #     human_description=I18nObject(
                        #         en_US=property.get('description', ''),
                        #         zh_Hans=property.get('description', '')
                        #     ),
                        #     type=ToolParameter.ToolParameterType.STRING,
                        #     required=name in required,
                        #     form=ToolParameter.ToolParameterForm.LLM,
                        #     llm_description=property.get(
                        #         'description', ''),
                        #     default=property.get('default', None),
                        # )

                        # check if there is a type
                        # typ = ApiBasedToolSchemaParser._get_tool_parameter_type(
                        #     property)
                        # if typ:
                        #     tool.type = typ

                        # parameters.append(tool)

            if 'operationId' not in interface['operation']:
                # remove special characters like / to ensure the operation id is valid ^[a-zA-Z0-9_-]{1,64}$
                path = interface['path']
                if interface['path'].startswith('/'):
                    path = interface['path'][1:]
                # remove special characters like / to ensure the operation id is valid ^[a-zA-Z0-9_-]{1,64}$
                path = re.sub(r'[^a-zA-Z0-9_-]', '', path)
                if not path:
                    path = str(uuid.uuid4())

                interface['operation']['operationId'] = f'{path}_{interface["method"]}'
            bundles.append(PluginApiCreate(
                plugin_config_id=plugin_config_id,
                openapi_desc=interface['operation'],
                name=openapi['info']['title'],
                description=openapi['info']['description'],
                created_at=now,
                created_by=operator,
                updated_at=now,
                updated_by=operator,
                server_url=server_url + '',
                method=interface['method'],
                summary=interface['operation']['description'] if 'description' in interface['operation'] else interface['operation'].get(
                    'summary', None),
                operation_id=interface['operation']['operationId'],
                parameters=parameters,
                disabled=False,
            ))

        return bundles
