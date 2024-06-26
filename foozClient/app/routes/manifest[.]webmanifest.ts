import { json } from '@remix-run/node';
import {icons} from '../../public/icons/icons.json'

export const loader = async () => {
  console.log(icons);
  icons.forEach(i => { if (!i.src.startsWith('icons/')) i.src = 'icons/'+i.src});
  return json(
    {
      short_name: 'Fooz',
      name: 'Foosball Tournament App',
      start_url: '/',
      display: 'standalone',
      background_color: '#334155',
      theme_color: '#075985',
      shortcuts: [
        {
          name: 'Homepage',
          url: '/',
          icons: [
            {
              src: '/favicon.ico',
              sizes: '256x256',
              type: 'image/x-icon',
              purpose: 'any monochrome',
            },
          ],
        },
      ],
      icons: [
        ...icons,
        {
          src: '/favicon.ico',
          sizes: '256x256',
          type: 'image/x-icon',
        },
      ],
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=600',
        'Content-Type': 'application/manifest+json',
      },
    }
  );
};
