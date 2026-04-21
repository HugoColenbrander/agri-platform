import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const [
      totalBedrijven,
      totalBodemAnalyses,
      totalSubsidies,
      totalDocuments,
      recentAnalyses,
    ] = await Promise.all([
      prisma.bedrijf.count(),
      prisma.bodemAnalyse.count(),
      prisma.subsidie.count(),
      prisma.document.count(),
      prisma.bodemAnalyse.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          bedrijf: {
            select: { naam: true },
          },
        },
      }),
    ])

    return NextResponse.json({
      totalBedrijven,
      totalBodemAnalyses,
      totalSubsidies,
      totalDocuments,
      recentAnalyses,
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
