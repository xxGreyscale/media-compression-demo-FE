import { createBrowserRouter } from 'react-router-dom'
import App from '../../App'
import { VideoUploadPage } from '../page/VideoUploadPage'
import { NotFoundPage } from '../page/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <VideoUploadPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
