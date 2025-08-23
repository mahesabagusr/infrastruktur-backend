import { prisma } from "@/helpers/db/prisma.js";

export default class UserRepository {
  static async findUserByEmailOrUsername(identifier) {
    return prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier },
        ],
      },
    });
  }

  static async createUser(userData) {
    const { username, firstName, lastName, email, hashPassword, signature, phoneNumber, street, provinceId, regencyId } = userData;

    return prisma.user.create({
      data: {
        username,
        firstname: firstName,
        lastname: lastName,
        email,
        password: hashPassword,
        signature: signature,
        phone_number: phoneNumber,
        address: {
          create: {
            street: street,
            province_id: provinceId,
            regency_id: regencyId,
          }
        }
      },
    });
  }

  static async saveRefreshToken(token, userId) {
    return prisma.refresh_token.create({
      data: {
        token: token,
        user_id: userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  static async findActiveRefreshToken(token) {
    return prisma.refresh_token.findFirst({
      where: { token: token },
      include: { user: true }
    });
  }

  static async deleteRefreshTokenById(tokenId) {
    return prisma.refresh_token.delete({
      where: { id: tokenId }
    });
  }

  static async deleteRefreshTokenByToken(token) {
    return prisma.refresh_token.deleteMany({
      where: { token: token },
    });
  }

  static async findUserById(userId) {
    return prisma.user.findUnique({
      where: { user_id: parseInt(userId) },
      select: {
        user_id: true,
        username: true,
        firstname: true,
        lastname: true,
        email: true,
        signature: true,
        phone_number: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        address: {
          select: {
            street: true,
            latitude: true,
            longitude: true,
            province: { select: { province_id: true, name: true } },
            regency: { select: { regency_id: true, name: true } },
          }
        },
        _count: {
          select: {
            reports: true,
          }
        },
        reports: {
          select: {
            report_id: true,
            title: true,
            description: true,
            verification_status: true,
            photoUrl: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        }
      }
    });
  }
}