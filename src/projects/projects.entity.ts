import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  category: number;
  @Column()
  tag: string;
  @Column()
  url_path: string;
  @Column()
  image_path: string;
  @Column()
  image_delete_id: string;
}
