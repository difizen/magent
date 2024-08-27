from fastapi import APIRouter
from agentuniverse_product.service.workflow_service.workflow_service import WorkflowService
from agentuniverse_product.service.model.workflow_dto import WorkflowDTO

router = APIRouter()
workflow_router = router


@router.get("/workflows/{workflow_id}", response_model=WorkflowDTO | None)
async def get_agent_detail(workflow_id):
    return WorkflowService.get_workflow_detail(workflow_id)


@router.put("/workflows/{workflow_id}", response_model=WorkflowDTO | None)
async def update_agent(workflow_id, workflow: WorkflowDTO):
    return WorkflowService.update_workflow(workflow)

@router.post("/workflows", response_model=WorkflowDTO)
async def create_agent(workflow: WorkflowDTO):
    return WorkflowService.create_workflow(workflow)
