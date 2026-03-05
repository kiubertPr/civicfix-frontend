import {init} from './appFetch';
import * as userService from './userService';
import * as postService from './postService';
import * as mailService from './mailService';
import * as surveyService from './surveyService';


export {default as NetworkError} from "./NetworkError";

export default {init, userService, postService, mailService, surveyService};
