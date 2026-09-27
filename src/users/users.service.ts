import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import bcrypt from "bcryptjs";
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  getHashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
  async create(createUserDto: CreateUserDto) {
    const hashPassword = await this.getHashPassword(createUserDto.password);
    const user = await this.userModel.create({
      email: createUserDto.email,
      password: hashPassword
    })
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({
      _id: updateUserDto._id
    }, { ...updateUserDto });
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return "not found user";
    return await this.userModel.deleteOne({
      _id: id
    });
  }
}
