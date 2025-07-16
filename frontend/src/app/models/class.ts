import { SocialLink } from "./interface"

export class Posts{
  PostID: number
  PostTitle: string
  PostPhoto: string
  PostDescription: string
  PostName: string
  CreatedAt: string
  UserID: number
  Username: string
  ProfilePhoto: string
  Categories: string

  constructor(){
  this.PostID = 0
  this.PostTitle = ''
  this.PostPhoto = ''
  this.PostDescription = ''
  this.CreatedAt = ''
  this.UserID = 0
  this.Username = ''
  this.ProfilePhoto = ''
  this.Categories = ''
  this.PostName = ''
  }
}

export class Streak {
  CreatedAt: Date;

  constructor(){
    this.CreatedAt = new Date;
  }
}

export class User {
  UserID: number
  Name: string
  Username: string
  Password: string  
  ProfilePhoto: string
  CreatedAt: string
  Bio: string
  About: string
  SocialLinks: SocialLink[]
  TechStack: string[]
  RecentPosts: Posts[]

  constructor(){
    this.UserID = 0 
    this.Username = ''
    this.Name = ''
    this.Password = ''
    this.ProfilePhoto = ''
    this.CreatedAt = ''
    this.Bio = ''
    this.About = ''
    this.SocialLinks = []
    this.TechStack = []
    this.RecentPosts = []
  }

}




