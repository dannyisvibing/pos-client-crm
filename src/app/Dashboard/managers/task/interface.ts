interface TaskData extends BaseCardData {}

interface TasksSummary {
    completed: number,
    dismissed: number,
    pending: number,
    total: number
}

interface TasksPayload {
    summary: TasksSummary,
    tasks: TaskData[]
}
