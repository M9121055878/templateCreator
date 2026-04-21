import { NextResponse } from 'next/server';
import { getRoleById, updateRole, deleteRole } from 'src/lib/auth-db';
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
    
    // Check if user has admin role
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    const role = getRoleById(params.id);
    
    if (!role) {
      return NextResponse.json(
        { message: 'Role not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ role });
  } catch (error) {
    console.error('Get role error:', error);
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
    
    // Check if user has admin role
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, permissions } = body;

    const role = updateRole(params.id, {
      name,
      description,
      permissions,
    });

    return NextResponse.json({ role });
  } catch (error) {
    console.error('Update role error:', error);
    
    if (error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { message: 'Role name already exists' },
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
    
    // Check if user has admin role
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    const role = getRoleById(params.id);
    
    if (!role) {
      return NextResponse.json(
        { message: 'Role not found' },
        { status: 404 }
      );
    }

    // Prevent deleting default roles
    if (['admin', 'company_admin', 'user'].includes(role.name)) {
      return NextResponse.json(
        { message: 'Cannot delete default roles' },
        { status: 400 }
      );
    }

    deleteRole(params.id);

    return NextResponse.json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Delete role error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
