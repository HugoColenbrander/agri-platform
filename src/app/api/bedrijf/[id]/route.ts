import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const bedrijf = await prisma.bedrijf.findUnique({
    where: { id },
    include: {
      bodemAnalyses: {
        orderBy: { createdAt: 'desc' },
      },
      subsidies: {
        include: {
          subsidie: {
            select: {
              naam: true,
              code: true,
              beschrijving: true,
            },
          },
        },
        orderBy: { ingediendOp: 'desc' },
      },
      documents: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!bedrijf) {
    return NextResponse.json(
      { error: 'Bedrijf niet gevonden' },
      { status: 404 }
    );
  }

  return NextResponse.json(bedrijf);
}
