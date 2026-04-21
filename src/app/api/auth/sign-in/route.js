import { NextResponse } from 'next/server';
import { getUserByUsername, verifyPassword, getUserById } from 'src/lib/auth-db';
import { sign } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request) {
  try {
    console.log('Sign-in API route called');
    const body = await request.json();
    const { username, password } = body;

    console.log('Login attempt:', { username });

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const user = getUserByUsername(username);
    console.log('User found:', user ? 'yes' : 'no');

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(password, user.password_hash);
    console.log('Password valid:', isValidPassword ? 'yes' : 'no');

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    if (!user.is_active) {
      return NextResponse.json(
        { error: 'User account is inactive' },
        { status: 403 }
      );
    }

    const fullUser = getUserById(user.id);
    console.log('Full user retrieved:', fullUser ? 'yes' : 'no');

    const accessToken = sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: fullUser.role?.name,
        companyId: user.company_id,
        groupId: user.group_id,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Token generated successfully');
    return NextResponse.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: fullUser.role,
        company: fullUser.company,
        group: fullUser.group,
      },
    });
  } catch (error) {
    console.error('Sign in error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
