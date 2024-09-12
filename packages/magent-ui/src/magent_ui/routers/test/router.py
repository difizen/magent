from datetime import datetime
import time
from typing import AsyncIterable, Iterator
import sys
import asyncio
from fastapi import APIRouter

router = APIRouter()
test_router = router


class SlowSyncIterator:
    iter_time: int = 0
    max: int
    order: int

    def __init__(self, order, loop: int = 3):
        self.max = loop
        self.order = order

    def __iter__(self):
        return self

    def __next__(self):
        time.sleep(1)  # Simulating a time-consuming operation
        self.iter_time += 1
        print('slow_iter:', self.order, '-',  self.iter_time)
        print(datetime.now())
        if self.iter_time > self.max:
            print('__next__ raise StopIteration')
            raise StopIteration
        return self.iter_time


def next_item(sync_iter: Iterator):
    try:
        return next(sync_iter)
    except StopIteration:
        return StopIteration


async def iterator_to_async_iterable(sync_iter: Iterator) -> AsyncIterable:
    loop = asyncio.get_running_loop()
    while True:
        item = await asyncio.to_thread(next_item, sync_iter)
        if item is StopIteration:
            break
        yield item
        await asyncio.sleep(0)  # Allow other tasks to run


class TestService:
    @staticmethod
    def sleep(order: int = 0, t: int = 1):
        time.sleep(t)  # 模拟一个耗时操作
        print('sleep', order, '-', t)
        print(datetime.now())
        return order

    @staticmethod
    async def async_slow_iter(order: int, loop: int = 3):
        sync_iter = SlowSyncIterator(order, loop)
        async_iter = iterator_to_async_iterable(iter(sync_iter))
        final: int
        async for item in async_iter:
            print('async', datetime.now())
            final = item
        return final

    @staticmethod
    def slow_iter(order: int, loop: int = 3):
        sync_iter = SlowSyncIterator(order, loop)
        final: int
        for item in sync_iter:
            final = item
        return final

    @staticmethod
    async def async_sleep(order: int = 0, t: int = 1) -> int:
        def run():
            return TestService.sleep(order, t)
        return await asyncio.to_thread(run)


order = 0


@router.get("/test/sleep", response_model=int)
async def test_sleep():
    global order
    order += 1
    print('sync sleep', order)
    res = TestService.sleep(order)
    print('sync sleep end', order)
    return res


@router.get("/test/sleep_async", response_model=int)
async def test_sleep_async():
    global order
    order += 1
    print('async sleep', order)
    res = await TestService.async_sleep(order)
    print('async sleep end', order)
    return res


@router.get("/test/sleep_async_1", response_model=int)
async def test_sleep_async_1():
    global order
    order += 1
    print('1 async sleep', order)
    res = await TestService.async_sleep(order)
    print('1 async sleep end', order)
    return res
