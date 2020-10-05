
import dayjs from 'dayjs'

export class Sprint {

    constructor(sprintJson) {
        this.id = sprintJson.id
        this.name = sprintJson.name
        this.goal = sprintJson.goal
        this.startDate = dayjs(sprintJson.startDate)
        this.endDate = dayjs(sprintJson.endDate)
    }
}
