from fastapi import APIRouter
from agentuniverse_product.service.workflow_service.workflow_service import WorkflowService
from agentuniverse_product.service.model.workflow_dto import WorkflowDTO
from magent_ui.utils import AsyncTask

router = APIRouter()
workflow_router = router


@router.get("/workflows/{workflow_id}", response_model=WorkflowDTO | None)
async def get_agent_detail(workflow_id):
    return await AsyncTask.to_thread(WorkflowService.get_workflow_detail, workflow_id)


@router.put("/workflows/{workflow_id}", response_model=str | None)
async def update_agent(workflow_id, workflow: WorkflowDTO):
    return await AsyncTask.to_thread(WorkflowService.update_workflow, workflow)


@router.post("/workflows", response_model=WorkflowDTO)
async def create_agent(workflow: WorkflowDTO):
    return await AsyncTask.to_thread(WorkflowService.create_workflow, workflow)
