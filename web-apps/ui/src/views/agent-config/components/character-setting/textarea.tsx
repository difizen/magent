import { Input } from 'antd';
import type { TextAreaProps, TextAreaRef } from 'antd/es/input/TextArea.js';
import type { FormEvent, KeyboardEvent } from 'react';
import { useEffect } from 'react';
import { useCallback, useRef, useState } from 'react';

const AntTextArea = Input.TextArea;

/**
 * 高度自适应
 * @param props
 * @returns
 */
export const TextArea = (props: TextAreaProps) => {
  const { value } = props;
  const textRef = useRef<TextAreaRef>(null);

  const [height, setStateHeight] = useState<number | string>(60);

  const setHeight = useCallback(
    (h: number) => {
      if (h !== height) {
        setStateHeight(h);
      }
    },
    [height],
  );

  const onInput = useCallback(
    (e: FormEvent<HTMLTextAreaElement>) => {
      const element = e.target;
      if (element instanceof HTMLTextAreaElement) {
        setHeight(element.scrollHeight);
      }
    },
    [setHeight],
  );

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        if (!textRef.current?.resizableTextArea?.textArea) {
          return;
        }
        const element = textRef.current.resizableTextArea.textArea;
        element.style.height = `${element.scrollHeight - 20}px`;
        setHeight(element.scrollHeight);
      }
    },
    [setHeight],
  );

  useEffect(() => {
    if (!textRef.current?.resizableTextArea?.textArea) {
      return;
    }
    const element = textRef.current.resizableTextArea.textArea;
    setHeight(element.scrollHeight);
  }, [setHeight, value]);

  return (
    <AntTextArea
      style={{ height }}
      onInput={onInput}
      onKeyUp={onKey}
      ref={textRef}
      {...props}
    ></AntTextArea>
  );
};
