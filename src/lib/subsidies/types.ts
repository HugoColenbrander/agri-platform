export interface SubsidieRegel {
  code: string
  naam: string
  beschrijving: string
  vereisten: Record<string, unknown>
  bedragMin?: number
  bedragMax?: number
}

export interface SubsidieCheckInput {
  hectares: number
  leeftijd?: number
  ecologisch?: boolean
  veehouderij?: boolean
  sanering?: boolean
  startend?: boolean
  sancties?: boolean
}

export interface SubsidieCheckResultaat {
  code: string
  naam: string
  geschikt: boolean
  reden: string
  geschatBedrag?: number
}
