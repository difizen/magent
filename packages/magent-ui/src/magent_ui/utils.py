import asyncio
from concurrent.futures import ThreadPoolExecutor
from typing import AsyncIterable, Iterator
from multiprocessing import cpu_count


class AsyncTask():
    # 创建一个较大的线程池
    executor = ThreadPoolExecutor()

    @staticmethod
    def set_max_worker(max: int):
        AsyncTask.executor = ThreadPoolExecutor(max_workers=max)

    @staticmethod
    async def to_thread(func, *args, **kwargs):
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(AsyncTask.executor, func, *args, **kwargs)


# def next_item(sync_iter: Iterator):
#     """获取同步迭代器的下一个项目，如果结束则返回 StopIteration 哨兵值"""
#     try:
#         return next(sync_iter)
#     except StopIteration:
#         return StopIteration


# async def iterator_to_async_iterable(sync_iter: Iterator) -> AsyncIterable:
#     """将同步迭代器转换为异步可迭代对象"""
#     loop = asyncio.get_running_loop()
#     while True:
#         # 在线程中运行同步的 next 操作
#         item = await asyncio.to_thread(next_item, sync_iter)
#         if item is StopIteration:
#             # 如果返回值是 StopIteration 哨兵值，终止循环
#             break
#         yield item
#         await asyncio.sleep(0)  # 允许其他异步任务运行
