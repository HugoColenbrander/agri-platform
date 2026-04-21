export interface AlignmentResult {
  seqA: string
  seqB: string
  score: number
}

export function needlemanWunsch(seqA: string, seqB: string, match = 1, mismatch = -1, gap = -1): AlignmentResult {
  const a = seqA.toUpperCase(), b = seqB.toUpperCase()
  const m = a.length, n = b.length
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i * gap
  for (let j = 0; j <= n; j++) dp[0][j] = j * gap
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const score = a[i - 1] === b[j - 1] ? match : mismatch
      dp[i][j] = Math.max(dp[i - 1][j - 1] + score, dp[i - 1][j] + gap, dp[i][j - 1] + gap)
    }
  }
  let i = m, j = n
  let alA = '', alB = ''
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? match : mismatch)) {
      alA = a[i - 1] + alA; alB = b[j - 1] + alB; i--; j--
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + gap) {
      alA = a[i - 1] + alA; alB = '-' + alB; i--
    } else {
      alA = '-' + alA; alB = b[j - 1] + alB; j--
    }
  }
  return { seqA: alA, seqB: alB, score: dp[m][n] }
}
