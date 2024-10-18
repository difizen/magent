/* eslint-disable react/prop-types */
import {
  BaseView,
  ViewInstance,
  inject,
  singleton,
  useInject,
  view,
  ModalService,
} from '@difizen/mana-app';
import { Button, Col, Collapse, List, Row } from 'antd';
import { forwardRef } from 'react';

import { TagList } from '../../components/tag-list/index.js';
import { PluginManager } from '../../plugin/plugin-manager.js';
import { ToolIcon } from '../../tool/icon/index.js';

import { PluginCreateModalId } from './modal/create.js';
import './index.less';

export interface ToolItem {
  nickname: string;
  id: string;
  avatar: string;
  description: string;
  parameters: string[];
}

const viewId = 'magent-plugins';
export const slot = `${viewId}-slot`;

const PluginsViewComponent = forwardRef<HTMLDivElement>(
  function PluginsViewComponent(props, ref) {
    const instance = useInject<PluginsView>(ViewInstance);
    const plugins = useInject(PluginManager);
    const modalService = useInject(ModalService);

    return (
      <div ref={ref} className={viewId}>
        <Row className={`${viewId}-list-header`}>
          <Col className={`${viewId}-list-header-label`} span={8}>
            插件
          </Col>
          <Col className={`${viewId}-list-header-label`} span={8}>
            工具
          </Col>
          <Col className={`${viewId}-list-header-label`} span={8}>
            操作
          </Col>
        </Row>
        <Collapse
          bordered={false}
          defaultActiveKey={['1']}
          className={`${viewId}-list`}
          expandIcon={() => <></>}
          // style={{ background: token.colorBgContainer }}
          items={plugins.publicList.map((item) => {
            return {
              key: item.id,
              // label: item.nickname,
              label: (
                <div className={`${viewId}-list-row`}>
                  <Row className={`${viewId}-list-row-content`}>
                    <Col className={`${viewId}-list-item`} span={8}>
                      <div className={`${viewId}-list-item-info`}>
                        <ToolIcon size={52} data={item} />
                        <div className={`${viewId}-list-item-info-text`}>
                          <label className={`${viewId}-list-item-info-name`}>
                            {item.nickname}
                          </label>
                          <label className={`${viewId}-list-item-info-desc`}>
                            {item.description}
                          </label>
                        </div>
                      </div>
                    </Col>
                    <Col className={`${viewId}-list-item`} span={8}>
                      <TagList
                        tags={item.toolset.map((item) =>
                          item.openapi_schema && item.openapi_schema['method']
                            ? `${item.openapi_schema['method']}: ${item.openapi_schema['path']}`
                            : item.nickname,
                        )}
                        maxWidth={400}
                      ></TagList>
                    </Col>
                    <Col className={`${viewId}-list-item`} span={8}></Col>
                  </Row>
                </div>
              ),

              children: item.toolset.map((tool) => (
                <Row key={tool.id} className={`${viewId}-tool`}>
                  <Col className={`${viewId}-tool-item`} span={16}>
                    <div className={`${viewId}-tool-item-info`}>
                      <label className={`${viewId}-tool-item-info-name`}>
                        {tool.nickname}
                      </label>
                      <label className={`${viewId}-tool-item-info-desc`}>
                        {tool.description}
                      </label>
                    </div>
                  </Col>

                  <Col className={`${viewId}-tool-item`} span={8}></Col>
                </Row>
              )),
            };
          })}
        />
        <div className={`${viewId}-creation`}>
          <Button
            onClick={() => {
              modalService.openModal(PluginCreateModalId);
            }}
            type="default"
          >
            创建插件
          </Button>
        </div>
      </div>
    );
  },
);

@singleton()
@view(viewId)
export class PluginsView extends BaseView {
  override view = PluginsViewComponent;

  @inject(PluginManager) pluginManager: PluginManager;

  override async onViewMount(): Promise<void> {
    this.pluginManager.updatePublic();
  }
}
