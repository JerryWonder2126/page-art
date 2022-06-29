import express, {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/auth.model';

const router = express.Router();

const checkCallbackURL = (req: Request, res: Response, next: NextFunction) => {
  const callbackURL = req.query.callback;
  if (!callbackURL) {
    res.status(403).send('Callback url not specified');
    res.end();
  } else {
    next();
  }
};

router.get('/', checkCallbackURL, (req: Request, res: Response) => {
  return res.render('auth/login.ejs', {error: '', form: {}});
});

router.post('/', checkCallbackURL, async (req: Request, res: Response) => {
  let error = '';
  try {
    const email: string = req.body['email'];
    const password: string = req.body['password'];
    if (!email) {
      throw Error('Email field cannot be left empty');
    }
    if (!password) {
      throw Error('Password field cannot be left empty');
    }
    const verified = await User.verify(email, password);
    if (!verified) {
      throw Error('Invalid login details.');
    }
    const token = jwt.sign(
      {authenticated: true},
      process.env.COOKIE_SECRET as string,
      {
        expiresIn: '3h',
      }
    );
    const redirectURL = `${req.query.callback}/?access-token=${token}`;
    return res.redirect(redirectURL);
  } catch (err: any) {
    error = err.message;
  }

  return res.render('auth/login.ejs', {error, form: req.body});
});

router.get('/signup', (req: Request, res: Response) => {
  return res.render('auth/signup.ejs');
});

router.post('/signup', async (req: Request, res: Response) => {
  const email: string = req.body['email'];
  const password: string = req.body['password'];
  const user = await User.create(email, password);
  if (user) {
    console.log(user);
  }
  return res.render('auth/signup.ejs');
});

router.post('/status/:email', async (req: Request, res: Response) => {
  /**
   * To get authentication status
   */
  const token = await User.getAccessToken(req.params['email']);
  const authDetail = jwt.verify(token, process.env.COOKIE_SECRET as string);
  console.log(authDetail);
  res.send({
    active: req.session ? true : false,
  });
});

export default router;
