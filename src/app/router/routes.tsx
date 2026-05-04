import { createBrowserRouter } from 'react-router-dom'
import App from '../../App'
import { LandingPage } from '../page/LandingPage'
import { ImageUploadPage } from '../page/ImageUploadPage'
import { VideoUploadPage } from '../page/VideoUploadPage'
import { NotFoundPage } from '../page/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'image',
        element: <ImageUploadPage />,
      },
      {
        path: 'video',
        element: <VideoUploadPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
