import {
  mdiAccountCircle,
  mdiMonitor,
  mdiGithub,
  mdiLock,
  mdiAlertCircle,
  mdiSquareEditOutline,
  mdiTable,
  mdiCog,
  mdiConsole,
  mdiTelevisionGuide,
  mdiResponsive,
  mdiPalette,
  mdiReact,
  mdiKubernetes,
} from '@mdi/js'

export default [
  {
    to: '/dashboard',
    icon: mdiMonitor,
    label: 'Dashboard',
  },
  {
    label: 'Kubernetes',
    icon: mdiKubernetes,
    menu: [
      {
        to: '/kubeconfig',
        label: 'KubeConfig',
        icon: mdiCog,
      },
      {
        to: '/kubectl',
        label: 'Kubectl',
        icon: mdiConsole,
      },
      {
        to: '/apply',
        label: 'Apply YAML',
        icon: mdiSquareEditOutline,
        label: 'Apply File',
      },
    ],
  },
  {
    to: '/github',
    label: 'GitHub Repo',
    icon: mdiGithub,
  },
  {
    to: '/tables',
    label: 'Tables',
    icon: mdiTable,
  },
  {
    to: '/forms',
    label: 'Forms',
    icon: mdiSquareEditOutline,
  },
  {
    to: '/ui',
    label: 'UI',
    icon: mdiTelevisionGuide,
  },
  {
    to: '/responsive',
    label: 'Responsive',
    icon: mdiResponsive,
  },
  {
    to: '/',
    label: 'Styles',
    icon: mdiPalette,
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: mdiAccountCircle,
  },
  {
    to: '/login',
    label: 'Login',
    icon: mdiLock,
  },
  {
    to: '/error',
    label: 'Error',
    icon: mdiAlertCircle,
  },
  {
    href: 'https://github.com/justboil/admin-one-react-tailwind',
    label: 'React version',
    icon: mdiReact,
    target: '_blank',
  },
]
