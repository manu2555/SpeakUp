import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User';

interface FeedbackAttributes {
  id: string;
  type: 'COMPLAINT' | 'SUGGESTION' | 'COMPLIMENT';
  department: string;
  agency: string;
  subject: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface FeedbackCreationAttributes extends Omit<FeedbackAttributes, 'id'> {}

class Feedback extends Model<FeedbackAttributes, FeedbackCreationAttributes> implements FeedbackAttributes {
  public id!: string;
  public type!: 'COMPLAINT' | 'SUGGESTION' | 'COMPLIMENT';
  public department!: string;
  public agency!: string;
  public subject!: string;
  public description!: string;
  public status!: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  public userId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Feedback.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM('COMPLAINT', 'SUGGESTION', 'COMPLIMENT'),
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    agency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Feedback',
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['department'],
      },
      {
        fields: ['type'],
      },
      {
        fields: ['status'],
      },
    ],
  }
);

// Define associations
Feedback.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(Feedback, {
  foreignKey: 'userId',
  as: 'feedbacks',
});

export default Feedback; 