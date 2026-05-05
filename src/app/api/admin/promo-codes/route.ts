import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = (await getServerSession(authOptions));
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const codes = await prisma.promoCode.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(codes);
}

export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions));
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { code, discount, maxUses, expiresAt } = await req.json();
  if (!code || !discount) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const promoCode = await prisma.promoCode.create({
    data: {
      code: code.toUpperCase(),
      discount: parseInt(discount),
      maxUses: maxUses ? parseInt(maxUses) : 0,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  return NextResponse.json(promoCode);
}

export async function DELETE(req: NextRequest) {
  const session = (await getServerSession(authOptions));
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  await prisma.promoCode.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const session = (await getServerSession(authOptions));
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, active } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const updated = await prisma.promoCode.update({
    where: { id },
    data: { active },
  });

  return NextResponse.json(updated);
}
