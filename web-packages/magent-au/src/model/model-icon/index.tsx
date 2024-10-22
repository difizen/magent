import { lazy, Suspense } from 'react';

import type { LLMMeta } from '../protocol.js';

const LazyIcon = (props: { loader: () => Promise<any> }) => {
  const Component = lazy(async () => {
    const icon = await props.loader();
    return { default: () => <img src={icon.default} /> };
  });
  return (
    <Suspense fallback={<DefaultLLMIcon></DefaultLLMIcon>}>
      <Component />
    </Suspense>
  );
};

export const DefaultLLMIcon = () => {
  return (
    <svg
      className="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M873.0624 270.5408l-325.8368-184.32a69.632 69.632 0 0 0-68.1984 0l-326.0416 184.32A66.9696 66.9696 0 0 0 118.784 327.68v368.64a66.9696 66.9696 0 0 0 34.2016 57.1392l326.0416 184.32a70.0416 70.0416 0 0 0 34.2016 9.0112 69.2224 69.2224 0 0 0 33.9968-9.0112l325.8368-184.32A66.7648 66.7648 0 0 0 907.0592 696.32V327.68a66.7648 66.7648 0 0 0-33.9968-57.1392zM487.6288 528.384v356.7616l-309.248-174.2848a16.9984 16.9984 0 0 1-8.6016-14.5408V350.8224z m344.4736-223.232L512 484.5568 192.3072 307.2l312.1152-176.128a18.0224 18.0224 0 0 1 8.6016-2.2528 19.2512 19.2512 0 0 1 8.6016 2.2528z m24.576 43.008v348.16a16.7936 16.7936 0 0 1-9.0112 14.1312L538.624 885.1456V526.9504z"
        fill="#333333"
      ></path>
    </svg>
  );
};

const match = (data: LLMMeta, name: string): boolean => {
  const labels = [data.id, data.nickname, data.model_name?.[0]];

  if (
    labels
      .filter((item) => !!item)
      .map((item) => item!.toLowerCase())
      .find((item) => item.includes(name))
  ) {
    return true;
  }
  return false;
};

export const LLMIcon = (props: { data: LLMMeta }) => {
  const { data } = props;
  if (match(data, 'qwen')) {
    return <LazyIcon loader={() => import('./qwen.svg')} />;
  }
  if (match(data, 'openai')) {
    return <LazyIcon loader={() => import('./openai.svg')} />;
  }
  if (match(data, 'baichuan')) {
    return <LazyIcon loader={() => import('./baichuan.svg')} />;
  }
  if (match(data, 'deepseek')) {
    return <LazyIcon loader={() => import('./deepseek.svg')} />;
  }
  if (match(data, 'ernie')) {
    return <LazyIcon loader={() => import('./ernie.svg')} />;
  }
  if (match(data, 'moonshot')) {
    return <LazyIcon loader={() => import('./moonshot.svg')} />;
  }
  return <DefaultLLMIcon />;
};
