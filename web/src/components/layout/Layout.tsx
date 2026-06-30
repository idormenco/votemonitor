import type { FunctionComponent } from '@/common/types';
import type { ReactNode } from 'react';
import BackButton from './Breadcrumbs/BackButton';
import Breadcrumbs from './Breadcrumbs/Breadcrumbs';

interface LayoutProps {
  title?: string;
  subtitle?: string;
  enableBreadcrumbs?: boolean;
  enableBackButton?: boolean;
  breadcrumbs?: ReactNode;
  backButton?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}

const Layout = ({
  title,
  subtitle,
  actions,
  backButton,
  breadcrumbs,
  children,
  enableBreadcrumbs = true,
  enableBackButton,
}: LayoutProps): FunctionComponent => {
  return (
    <>
      <header className='container py-6 border-b border-border/50'>
        <div className='flex flex-col gap-2'>
          {enableBreadcrumbs && (breadcrumbs || <Breadcrumbs />)}
          <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-3'>
              {(enableBreadcrumbs || enableBackButton) && (backButton || <BackButton />)}
              <h1 className='text-2xl font-bold tracking-tight text-foreground'>
                {title}
              </h1>
            </div>
            {!!actions && <div className='flex gap-2 mt-3 sm:mt-0'>{actions}</div>}
          </div>
          {subtitle && <p className='text-sm text-muted-foreground'>{subtitle}</p>}
        </div>
      </header>
      <main className='container py-6 flex flex-col flex-1'>{children}</main>
    </>
  );
};

export default Layout;
