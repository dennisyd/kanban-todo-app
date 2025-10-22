export function calculateNewPosition(
  previousPosition: number | null,
  nextPosition: number | null
): number {
  const gap = 1000

  if (previousPosition === null && nextPosition === null) {
    return gap
  }

  if (previousPosition === null) {
    return nextPosition! - gap
  }

  if (nextPosition === null) {
    return previousPosition + gap
  }

  return Math.floor((previousPosition + nextPosition) / 2)
}

export function rebalancePositions(items: Array<{ id: string; position: number }>) {
  const gap = 1000
  return items
    .sort((a, b) => a.position - b.position)
    .map((item, index) => ({
      id: item.id,
      position: index * gap,
    }))
}

export function needsRebalancing(positions: number[]): boolean {
  const sortedPositions = [...positions].sort((a, b) => a - b)
  
  for (let i = 1; i < sortedPositions.length; i++) {
    const gap = sortedPositions[i] - sortedPositions[i - 1]
    if (gap < 10) {
      return true
    }
  }
  
  return false
}

