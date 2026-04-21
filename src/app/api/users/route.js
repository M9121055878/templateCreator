import { NextResponse } from 'next/server';
import { listUsers, createUser } from 'src/lib/auth-db';
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
    
    // Check if user has admin role
    if (decoded.role !== 'super_admin') {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const groupId = searchParams.get('groupId');
    const roleId = searchParams.get('roleId');
    const isActive = searchParams.get('isActive');

    const users = listUsers({
      companyId,
      groupId,
      roleId,
      isActive: isActive !== null ? isActive === 'true' : undefined,
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('List users error:', error);
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
    
    // Check if user has admin role
    if (decoded.role !== 'super_admin') {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { username, password, firstName, lastName, roleId, companyId, groupId } = body;

    if (!username || !password || !firstName || !lastName) {
      return NextResponse.json(
        { message: 'Username, password, first name, and last name are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const user = await createUser({
      email: username,
      password,
      firstName,
      lastName,
      roleId,
      companyId,
      groupId,
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Create user error:', error);

    if (error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { message: 'Username already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
