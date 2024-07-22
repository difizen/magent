import json
from typing import Any
from urllib.parse import urlencode
import httpx
from models.plugin_api import PluginApiModel
import core.utils.ssrf_proxy as ssrf_proxy


class ApiTool:
    plugin_api_model: PluginApiModel

    def __init__(self, plugin_api_model):
        self.plugin_api_model = plugin_api_model

    @staticmethod
    def get_parameter_value(parameter, parameters):
        if parameter['name'] in parameters:
            return parameters[parameter['name']]
        elif parameter.get('required', False):
            raise Exception(f"Missing required parameter {parameter['name']}")
        else:
            return (parameter.get('schema', {}) or {}).get('default', None)

    def _convert_body_property_any_of(self, property: dict[str, Any], value: Any, any_of: list[dict[str, Any]],
                                      max_recursive=10) -> Any:
        if max_recursive <= 0:
            raise Exception("Max recursion depth reached")
        for option in any_of or []:
            try:
                if 'type' in option:
                    # Attempt to convert the value based on the type.
                    if option['type'] == 'integer' or option['type'] == 'int':
                        return int(value)
                    elif option['type'] == 'number':
                        if '.' in str(value):
                            return float(value)
                        else:
                            return int(value)
                    elif option['type'] == 'string':
                        return str(value)
                    elif option['type'] == 'boolean':
                        if str(value).lower() in ['true', '1']:
                            return True
                        elif str(value).lower() in ['false', '0']:
                            return False
                        else:
                            continue  # Not a boolean, try next option
                    elif option['type'] == 'null' and not value:
                        return None
                    else:
                        continue  # Unsupported type, try next option
                elif 'anyOf' in option and isinstance(option['anyOf'], list):
                    # Recursive call to handle nested anyOf
                    return self._convert_body_property_any_of(property, value, option['anyOf'], max_recursive - 1)
            except ValueError:
                continue  # Conversion failed, try next option
        # If no option succeeded, you might want to return the value as is or raise an error
        # or raise ValueError(f"Cannot convert value '{value}' to any specified type in anyOf")
        return value

    def _convert_body_property_type(self, property: dict[str, Any], value: Any) -> Any:
        try:
            if 'type' in property:
                if property['type'] == 'integer' or property['type'] == 'int':
                    return int(value)
                elif property['type'] == 'number':
                    # check if it is a float
                    if '.' in value:
                        return float(value)
                    else:
                        return int(value)
                elif property['type'] == 'string':
                    return str(value)
                elif property['type'] == 'boolean':
                    return bool(value)
                elif property['type'] == 'null':
                    if value is None:
                        return None
                elif property['type'] == 'object':
                    if isinstance(value, str):
                        try:
                            return json.loads(value)
                        except ValueError:
                            return value
                    elif isinstance(value, dict):
                        return value
                    else:
                        return value
                else:
                    raise ValueError(
                        f"Invalid type {property['type']} for property {property}")
            elif 'anyOf' in property and isinstance(property['anyOf'], list):
                return self._convert_body_property_any_of(property, value, property['anyOf'])
        except ValueError as e:
            return value

    def do_http_request(self, url: str, method: str, headers: dict[str, Any],
                        parameters: dict[str, Any]) -> httpx.Response:
        """
            do http request depending on api bundle
        """
        method = method.lower()

        params = {}
        path_params = {}
        body = {}
        cookies = {}

        # check parameters
        for parameter in self.plugin_api_model.openapi_desc.get('parameters', []):
            value = self.get_parameter_value(parameter, parameters)
            if value is not None:
                if parameter['in'] == 'path':
                    path_params[parameter['name']] = value

                elif parameter['in'] == 'query':
                    params[parameter['name']] = value

                elif parameter['in'] == 'cookie':
                    cookies[parameter['name']] = value

                elif parameter['in'] == 'header':
                    headers[parameter['name']] = value

        # check if there is a request body and handle it
        if 'requestBody' in self.plugin_api_model.openapi_desc and self.plugin_api_model.openapi_desc['requestBody'] is not None:
            # handle json request body
            if 'content' in self.plugin_api_model.openapi_desc['requestBody']:
                for content_type in self.plugin_api_model.openapi_desc['requestBody']['content']:
                    headers['Content-Type'] = content_type
                    body_schema = self.plugin_api_model.openapi_desc[
                        'requestBody']['content'][content_type]['schema']
                    required = body_schema.get('required', [])
                    properties = body_schema.get('properties', {})
                    for name, property in properties.items():
                        if name in parameters:
                            # convert type
                            body[name] = self._convert_body_property_type(
                                property, parameters[name])
                        elif name in required:
                            raise Exception(
                                f"Missing required parameter {name} in operation {self.plugin_api_model.operation_id}"
                            )
                        elif 'default' in property:
                            body[name] = property['default']
                        else:
                            body[name] = None
                    break

        # replace path parameters
        for name, value in path_params.items():
            url = url.replace(f'{{{name}}}', f'{value}')

        # parse http body data if needed, for GET/HEAD/OPTIONS/TRACE, the body is ignored
        if 'Content-Type' in headers:
            if headers['Content-Type'] == 'application/json':
                body = json.dumps(body)
            elif headers['Content-Type'] == 'application/x-www-form-urlencoded':
                body = urlencode(body)
            else:
                body = body

        if method in ('get', 'head', 'post', 'put', 'delete', 'patch'):
            response = getattr(ssrf_proxy, method)(url, params=params, headers=headers, data=body,
                                                   follow_redirects=True)
            return response
        else:
            raise ValueError(f'Invalid http method')

    def validate_and_parse_response(self, response: httpx.Response) -> str:
        """
            validate the response
        """
        if isinstance(response, httpx.Response):
            if response.status_code >= 400:
                raise Exception(
                    f"Request failed with status code {response.status_code} and {response.text}")
            if not response.content:
                return 'Empty response from the tool, please check your parameters and try again.'
            try:
                response = response.json()
                try:
                    return json.dumps(response, ensure_ascii=False)
                except Exception as e:
                    return json.dumps(response)
            except Exception as e:
                return response.text
        else:
            raise ValueError(f'Invalid response type {type(response)}')

    def _invoke(self, tool_parameters: dict[str, Any]) -> str | list[str]:
        """
        invoke http request
        """
        # assemble request
        headers = {}

        # do http request
        response = self.do_http_request(
            self.plugin_api_model.server_url, self.plugin_api_model.method, headers, tool_parameters)

        # validate response
        response = self.validate_and_parse_response(response)

        # assemble invoke message
        return response
