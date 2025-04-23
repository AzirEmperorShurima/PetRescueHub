import users from './users';
import pets from './pets';
import events from './events';
import eventsMock from './eventsMock';
import donations from './donations';
import volunteers from './volunteers';
import rescues from './rescues';
import comments from './comments';
import { forumPosts, forumQuestions, forumEvents, forumCategories } from './forum';
import { usersMock, loginResponseMock, adminLoginResponseMock } from './authMock';
import { postDetailMock, postCommentsMock } from './postDetailMock';
import { eventDetailMock, eventCommentsMock } from './eventDetailMock';
import petsMock from './adoptMock';
import homeMock from './homeMock';

// Destructure and export from homeMock
export const { 
  heroSlides, 
  services, 
  recentRescues, 
  testimonials, 
  stats 
} = homeMock;

export {
  users,
  pets,
  events,
  eventsMock,
  donations,
  volunteers,
  rescues,
  comments,
  forumPosts,
  forumQuestions,
  forumEvents,
  forumCategories,
  usersMock,
  loginResponseMock,
  adminLoginResponseMock,
  postDetailMock,
  postCommentsMock,
  eventDetailMock,
  eventCommentsMock,
  petsMock,
  homeMock
};