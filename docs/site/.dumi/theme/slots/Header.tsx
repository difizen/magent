import { Link, useLocation, useNavData, useSiteData } from 'dumi';
import React from 'react';

import SearchBar from '../componets/search-bar';
import useScroll from '../hooks/useScroll.js';
import './Header.less';

const NavBar: React.FC = () => {
  const nav = useNavData();
  const { pathname } = useLocation();
  const activeKey = `/${pathname.split('/')?.[1]}`;
  return (
    <div>
      {nav.map((it) => (
        <Link
          to={it.link}
          key={`${it.title}-${it.link}`}
          style={{
            textDecoration: 'none',
          }}
        >
          <span
            style={{
              textDecoration: 'none',
              color:
                activeKey === it.link ? 'rgb(22, 119, 255)' : 'rgba(0, 0, 0, 0.88)',
              margin: '0 16px',
            }}
          >
            {it.title}
          </span>
        </Link>
      ))}
    </div>
  );
};

const Header: React.FC = () => {
  const scroll = useScroll();
  const { themeConfig } = useSiteData();

  return (
    <nav
      className="difizen-dumi-header"
      style={{
        background: scroll > 70 ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0)',
      }}
    >
      <div className="difizen-dumi-header-logo">
        {themeConfig.logo && (
          <Link
            style={{
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: 22,
              alignItems: 'center',
              display: 'inline-flex',
              marginRight: 32,
              color: '#30363f',
            }}
            to={themeConfig['link']}
          >
            <svg
              className="icon"
              style={{
                padding: 4,
              }}
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
            >
              <path
                d="M688.355556 227.555556l17.066666-68.266667c22.755556-5.688889 45.511111-22.755556 51.2-51.2 11.377778-34.133333-11.377778-73.955556-45.511111-85.333333-34.133333-11.377778-73.955556 11.377778-85.333333 45.511111-5.688889 22.755556 0 45.511111 17.066666 62.577777L620.088889 227.555556H403.911111l-22.755555-91.022223c11.377778-17.066667 17.066667-34.133333 11.377777-56.888889-11.377778-34.133333-45.511111-56.888889-85.333333-45.511111-34.133333 5.688889-56.888889 45.511111-45.511111 79.644445 5.688889 28.444444 28.444444 45.511111 51.2 51.2L335.644444 227.555556C147.911111 244.622222 0 403.911111 0 597.333333 0 802.133333 164.977778 967.111111 369.777778 967.111111h284.444444c204.8 0 369.777778-164.977778 369.777778-369.777778 0-193.422222-147.911111-347.022222-335.644444-369.777777z m-34.133334 568.888888h-284.444444C261.688889 796.444444 170.666667 705.422222 170.666667 597.333333S261.688889 398.222222 369.777778 398.222222h284.444444c108.088889 0 199.111111 91.022222 199.111111 199.111111S762.311111 796.444444 654.222222 796.444444z"
                fill="#4F97FF"
              ></path>
              <path
                d="M398.222222 529.066667c-17.066667 0-34.133333 17.066667-34.133333 34.133333v68.266667c0 17.066667 17.066667 34.133333 34.133333 34.133333s34.133333-17.066667 34.133334-34.133333V563.2c0-17.066667-17.066667-34.133333-34.133334-34.133333zM625.777778 529.066667c-17.066667 0-34.133333 17.066667-34.133334 34.133333v68.266667c0 17.066667 17.066667 34.133333 34.133334 34.133333s34.133333-17.066667 34.133333-34.133333V563.2c0-17.066667-17.066667-34.133333-34.133333-34.133333z"
                fill="#4F97FF"
              ></path>
            </svg>
            {themeConfig.name}
          </Link>
        )}
      </div>
      <NavBar />

      <div className="difizen-dumi-header-right">
        <SearchBar />
        {/* TODO 目前fork和stars是写死的，等后续采用接口 */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a
            href="https://github.com/difizen/magent"
            target="_blank"
            rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <div className="difizen-dumi-header-right-github-btn">
              <span className="difizen-dumi-header-right-github-btn-hint">Forks</span>
              <div style={{ color: 'rgb(66 78 102 / 100%)' }}>
                {themeConfig['githubInfo']?.forks || 0}
              </div>
            </div>
          </a>
          <a
            href="https://github.com/difizen/magent"
            target="_blank"
            rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <div className="difizen-dumi-header-right-github-btn">
              <span className="difizen-dumi-header-right-github-btn-hint">Stars</span>
              <div style={{ color: 'rgb(66 78 102 / 100%)' }}>
                {themeConfig['githubInfo']?.stars || 0}
              </div>
            </div>
          </a>
          <a target="_blank" href={themeConfig['githubInfo']?.url} rel="noreferrer">
            <img
              className="difizen-dumi-header-right-github-logo"
              src="https://mdn.alipayobjects.com/huamei_usjdcg/afts/img/A*Ybx5RKAUMbUAAAAAAAAAAAAADo6HAQ/original"
            />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Header;
