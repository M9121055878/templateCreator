import { NextResponse } from 'next/server';
import { listGroups, createGroup } from 'src/lib/auth-db';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verify(token, JWT_SECRET);
    
    // Check if user has admin or company_admin role
    if (decoded.role !== 'admin' && decoded.role !== 'company_admin') {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const isActive = searchParams.get('isActive');

    // If company admin, only show groups from their company
    const filterCompanyId = decoded.role === 'company_admin' ? decoded.companyId : companyId;

    const groups = listGroups({
      companyId: filterCompanyId,
      isActive: isActive !== null ? isActive === 'true' : undefined,
    });

    return NextResponse.json({ groups });
  } catch (error) {
    console.error('List groups error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verify(token, JWT_SECRET);
    
    // Check if user has admin or company_admin role
    if (decoded.role !== 'admin' && decoded.role !== 'company_admin') {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, slug, companyId } = body;

    if (!name || !slug || !companyId) {
      return NextResponse.json(
        { message: 'Name, slug, and company ID are required' },
        { status: 400 }
      );
    }

    // If company admin, they can only create groups in their company
    if (decoded.role === 'company_admin' && companyId !== decoded.companyId) {
      return NextResponse.json(
        { message: 'You can only create groups in your company' },
        { status: 403 }
      );
    }

    const group = createGroup({ name, slug, companyId });

    return NextResponse.json({ group }, { status: 201 });
  } catch (error) {
    console.error('Create group error:', error);
    
    if (error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { message: 'Slug already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
