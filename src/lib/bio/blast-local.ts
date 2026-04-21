export interface BlastHit {
  query: string
  subject: string
  score: number
  identity: number
  alignment: string
}

function smithWaterman(a: string, b: string): { score: number; identity: number; alignment: string } {
  const m = a.length, n = b.length
  const mat = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  let maxScore = 0
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const match = a[i - 1].toUpperCase() === b[j - 1].toUpperCase() ? 2 : -1
      mat[i][j] = Math.max(0, mat[i - 1][j - 1] + match, mat[i - 1][j] - 1, mat[i][j - 1] - 1)
      if (mat[i][j] > maxScore) maxScore = mat[i][j]
    }
  }
  const minLen = Math.min(m, n)
  const identity = minLen ? maxScore / (2 * minLen) : 0
  return { score: maxScore, identity: Math.min(1, identity), alignment: '' }
}

export function localBlast(query: string, subjects: string[]): BlastHit[] {
  return subjects.map((sub, i) => {
    const res = smithWaterman(query, sub)
    return { query: `query`, subject: `subject_${i}`, score: res.score, identity: res.identity, alignment: res.alignment }
  }).sort((a, b) => b.score - a.score)
}
