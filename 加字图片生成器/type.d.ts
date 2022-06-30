type ChildPath = string
export type MarkOption = {
    placement: Record<ChildPath, { text: string, color: string } | void>
    tag:
    Record<ChildPath,
        Record<string, {
            text: string, color: string
        } | void>
        | void
    >
    tagFillRectColor?: string
    inputPath: string
    outputPath: string
    placementMark: boolean
    placementMarkOther: boolean
}
