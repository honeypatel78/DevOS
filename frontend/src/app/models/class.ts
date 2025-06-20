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




