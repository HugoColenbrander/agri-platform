export interface PhyloNode {
  name: string
  distance?: number
  children?: PhyloNode[]
}

function hamming(a: string, b: string): number {
  let d = 0
  const len = Math.min(a.length, b.length)
  for (let i = 0; i < len; i++) if (a[i].toUpperCase() !== b[i].toUpperCase()) d++
  return d / len
}

export function upgma(sequences: { name: string; seq: string }[]): PhyloNode {
  const nodes: PhyloNode[] = sequences.map(s => ({ name: s.name }))
  const dists: number[][] = sequences.map((a, i) => sequences.map((b, j) => i === j ? 0 : hamming(a.seq, b.seq)))
  const n = nodes.length
  const active = new Array(n).fill(true)

  while (true) {
    let mini = -1, minj = -1, mind = Infinity
    for (let i = 0; i < n; i++) if (active[i]) {
      for (let j = i + 1; j < n; j++) if (active[j]) {
        if (dists[i][j] < mind) { mind = dists[i][j]; mini = i; minj = j }
      }
    }
    if (mini === -1) break
    const newNode: PhyloNode = { name: `Node_${mini}_${minj}`, distance: mind, children: [nodes[mini], nodes[minj]] }
    nodes.push(newNode)
    const newIdx = nodes.length - 1
    const newRow: number[] = []
    for (let k = 0; k < n; k++) if (active[k]) {
      newRow.push((dists[mini][k] + dists[minj][k]) / 2)
    }
    dists.push(newRow)
    for (let k = 0; k < n; k++) if (active[k]) dists[k].push(newRow[k])
    active[mini] = false
    active[minj] = false
    active.push(true)
  }

  return nodes[nodes.length - 1]
}
