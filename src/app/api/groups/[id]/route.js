import { NextResponse } from 'next/server';
import { getGroupById, updateGroup, deleteGroup } from 'src/lib/auth-db';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET(request, { params }) {
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

    const group = getGroupById(params.id);
    
    if (!group) {
      return NextResponse.json(
        { message: 'Group not found' },
        { status: 404 }
      );
    }

    // If company admin, check if group belongs to their company
    if (decoded.role === 'company_admin' && group.company_id !== decoded.companyId) {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json({ group });
  } catch (error) {
    console.error('Get group error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
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

    const group = getGroupById(params.id);
    
    if (!group) {
      return NextResponse.json(
        { message: 'Group not found' },
        { status: 404 }
      );
    }

    // If company admin, check if group belongs to their company
    if (decoded.role === 'company_admin' && group.company_id !== decoded.companyId) {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, slug, companyId, isActive } = body;

    // If company admin, they can only assign to their company
    if (decoded.role === 'company_admin' && companyId && companyId !== decoded.companyId) {
      return NextResponse.json(
        { message: 'You can only assign groups to your company' },
        { status: 403 }
      );
    }

    const updatedGroup = updateGroup(params.id, {
      name,
      slug,
      companyId,
      isActive,
    });

    return NextResponse.json({ group: updatedGroup });
  } catch (error) {
    console.error('Update group error:', error);
    
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

export async function DELETE(request, { params }) {
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

    const group = getGroupById(params.id);
    
    if (!group) {
      return NextResponse.json(
        { message: 'Group not found' },
        { status: 404 }
      );
    }

    // If company admin, check if group belongs to their company
    if (decoded.role === 'company_admin' && group.company_id !== decoded.companyId) {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    deleteGroup(params.id);

    return NextResponse.json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Delete group error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
