import { authApi } from '@/common/auth-api';
import { LanguageSelector } from '@/components/LanguageSelector/LanguageSelector';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { AuthContext } from '@/context/auth.context';
import { useCurrentElectionRoundStore } from '@/context/election-round.store';
import { ElectionEvent } from '@/features/election-event/models/election-event';
import { electionRoundKeys } from '@/features/election-rounds/queries';
import { staticDataKeys } from '@/hooks/query-keys';
import { sleep } from '@/lib/utils';
import { queryClient } from '@/main';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { PauseCircleIcon, PlayCircleIcon, StopCircleIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useRouter } from '@tanstack/react-router';
import clsx from 'clsx';
import { sortBy } from 'lodash';
import { Fragment, useContext, useEffect, useMemo, useState } from 'react';
import { ElectionRoundStatus, type FunctionComponent } from '../../../common/types';
import Logo from './Logo';
import { Label } from '@/components/ui/label';

const navigation = [
  { name: 'Dashboard', to: '/', roles: ['PlatformAdmin', 'NgoAdmin'] },
  { name: 'Election rounds', to: '/election-rounds', roles: ['PlatformAdmin'] },
  { name: 'NGOs', to: '/ngos', roles: ['PlatformAdmin'] },
  { name: 'Observers', to: '/observers', roles: ['PlatformAdmin'] },
  { name: 'Form templates', to: '/form-templates', roles: 'PlatformAdmin' },
  { name: 'Election event', to: '/election-event', roles: ['NgoAdmin'] },
  { name: 'Observers', to: '/monitoring-observers', roles: ['NgoAdmin'] },
  { name: 'Responses', to: '/responses', roles: ['NgoAdmin'] },
];
const userNavigation: { name: string; to: string }[] = [];

const Header = (): FunctionComponent => {
  const { userRole, signOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedElectionRound, setSelectedElection] = useState<ElectionEvent>();
  const router = useRouter();
  const { setCurrentElectionRoundId, currentElectionRoundId } = useCurrentElectionRoundStore((s) => s);

  const handleSelectElectionRound = async (electionRound?: ElectionEvent): Promise<void> => {
    if (electionRound && selectedElectionRound?.id != electionRound.id) {
      setSelectedElection(electionRound);
      setCurrentElectionRoundId(electionRound.id);

      sleep(1);

      await queryClient.invalidateQueries({
        predicate: (query) => {
          if (query.queryKey === electionRoundKeys.all) {
            return false;
          }

          if (query.queryKey[0] === staticDataKeys.all[0]) {
            return false;
          }

          return true;
        },
      });

      router.invalidate();
    }
  };

  const { status, data: electionRounds } = useQuery({
    queryKey: electionRoundKeys.all,
    queryFn: async () => {
      const response = await authApi.get<{ electionRounds: ElectionEvent[] }>('/election-rounds:monitoring');

      (response.data.electionRounds ?? []).forEach((er) => {
        queryClient.setQueryData(electionRoundKeys.detail(er.id), er);
      });
      return response.data.electionRounds ?? [];
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
    enabled: userRole === 'NgoAdmin',
  });

  useEffect(() => {
    if (!!electionRounds) {
      const electionRound = electionRounds.find((x) => x.id === currentElectionRoundId);
      handleSelectElectionRound(electionRound ?? electionRounds[0]);
    }
  }, [electionRounds]);

  const activeElections = useMemo(() => {
    return sortBy(
      [...(electionRounds ?? [])].filter((er) => er.status !== ElectionRoundStatus.Archived),
      (er) => new Date(er.startDate).getTime(),
      (er) => er.title
    );
  }, [electionRounds]);

  const archivedElections = useMemo(() => {
    return sortBy(
      [...(electionRounds ?? [])].filter((er) => er.status === ElectionRoundStatus.Archived),
      (er) => new Date(er.startDate).getTime(),
      (er) => er.title
    );
  }, [electionRounds]);

  return (
    <Disclosure as='nav' className='border-b border-border/50 bg-background sticky top-0 z-50'>
      {({ open }) => (
        <>
          <div className='container'>
            <div className='flex items-center justify-between h-14 gap-4 md:gap-6'>
              <Link to='/' className='flex items-center gap-2 shrink-0'>
                <Logo width={40} height={40} />
                <span className='hidden sm:block text-sm font-semibold text-foreground'>VoteMonitor</span>
              </Link>

              <div className='items-center flex-1 hidden gap-1 md:flex'>
                {navigation
                  .filter((nav) => nav.roles.includes(userRole ?? 'Unknown'))
                  .map((item) => (
                    <Link
                      to={item.to}
                      search={{}}
                      params={{}}
                      key={item.name}
                      className='px-3 py-1.5 text-sm font-medium rounded-md transition-colors'
                      activeProps={{
                        className: 'bg-accent text-accent-foreground',
                        'aria-current': 'page',
                      }}
                      inactiveProps={{
                        className:
                          'text-muted-foreground hover:text-foreground hover:bg-secondary',
                      }}>
                      {item.name}
                    </Link>
                  ))}
              </div>

              <div className='items-center hidden gap-3 md:flex'>
                {userRole !== 'NgoAdmin' ? (
                  <></>
                ) : status === 'pending' ? (
                  <Skeleton className='w-48 h-8 rounded-md' />
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Badge className='max-w-xs bg-secondary text-secondary-foreground hover:bg-secondary/80 truncate cursor-pointer'>
                        <div className='flex items-center gap-2 w-full'>
                          <div className='truncate' title={selectedElectionRound?.title}>
                            {selectedElectionRound?.title}
                          </div>
                          <ChevronDownIcon className='w-4 h-4 shrink-0' />
                        </div>
                      </Badge>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuRadioGroup
                        value={selectedElectionRound?.id ?? ''}
                        onValueChange={(value) => {
                          const electionRound = electionRounds?.find((er) => er.id === value);
                          handleSelectElectionRound(electionRound);
                        }}>
                        <DropdownMenuLabel> Upcomming elections </DropdownMenuLabel>

                        {activeElections?.map((electionRound) => (
                          <DropdownMenuRadioItem key={electionRound.id} value={electionRound.id}>
                            <div className='flex items-center gap-2'>
                              {electionRound?.status === ElectionRoundStatus.NotStarted ? (
                                <PauseCircleIcon className='w-4 h-4 text-slate-700' />
                              ) : null}
                              {electionRound?.status === ElectionRoundStatus.Started ? (
                                <PlayCircleIcon className='w-4 h-4 text-green-700' />
                              ) : null}
                              <div className='truncate max-w-[340px]' title={electionRound.title}>
                                {electionRound.title}
                              </div>
                            </div>
                          </DropdownMenuRadioItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel> Archived elections </DropdownMenuLabel>
                        {archivedElections?.map((electionRound) => (
                          <DropdownMenuRadioItem key={electionRound.id} value={electionRound.id}>
                            <div className='flex items-center gap-2'>
                              <StopCircleIcon className='w-4 h-4 text-yellow-700' />

                              <div className='truncate max-w-[340px]' title={electionRound.title}>
                                {electionRound.title}
                              </div>
                            </div>
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                <Menu as='div' className='relative'>
                  <div>
                    <Menu.Button className='relative flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors hover:bg-secondary p-1.5'>
                      <span className='sr-only'>Open user menu</span>
                      <UserCircleIcon className='w-6 h-6 fill-muted-foreground' />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter='transition ease-out duration-100'
                    enterFrom='transform opacity-0 scale-95'
                    enterTo='transform opacity-100 scale-100'
                    leave='transition ease-in duration-75'
                    leaveFrom='transform opacity-100 scale-100'
                    leaveTo='transform opacity-0 scale-95'>
                    <Menu.Items className='absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right bg-card rounded-md shadow-md border border-border focus:outline-none'>
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          <Link
                            to={item.to}
                            search={{}}
                            params={{}}
                            className='block px-4 py-2 text-sm text-foreground hover:bg-secondary focus:bg-secondary'>
                            {item.name}
                          </Link>
                        </Menu.Item>
                      ))}

                      <Menu.Item key='language-selector'>
                        <LanguageSelector />
                      </Menu.Item>

                      <Menu.Item key='sign-out'>
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='w-full justify-start px-4 text-sm text-foreground hover:bg-secondary'
                          onClick={() => {
                            signOut();
                            navigate({ to: '/login' });
                          }}>
                          Sign out
                        </Button>
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>

              <div className='flex md:hidden'>
                <Disclosure.Button
                  className={clsx(
                    'relative inline-flex items-center justify-center p-2 text-muted-foreground bg-transparent rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-colors',
                    { 'bg-secondary': open }
                  )}>
                  <span className='sr-only'>Open main menu</span>
                  {open ? (
                    <XMarkIcon className='block w-5 h-5' aria-hidden='true' />
                  ) : (
                    <Bars3Icon className='block w-5 h-5' aria-hidden='true' />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className='md:hidden border-t border-border'>
            <div className='px-2 py-2 space-y-1'>
              {navigation
                .filter((nav) => nav.roles.includes(userRole ?? 'Unknown'))
                .map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.to}
                    className='block px-3 py-2 text-sm font-medium rounded-md'
                    activeProps={{
                      className: 'bg-accent text-accent-foreground',
                      'aria-current': 'page',
                    }}
                    inactiveProps={{
                      className:
                        'text-muted-foreground hover:text-foreground hover:bg-secondary',
                    }}>
                    {item.name}
                  </Disclosure.Button>
                ))}
            </div>
            <div className='py-3 border-t border-border space-y-2 px-2'>
              {userNavigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.to}
                  className='block px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-md'>
                  {item.name}
                </Disclosure.Button>
              ))}
              {userRole !== 'NgoAdmin' ? (
                <></>
              ) : status === 'pending' ? (
                <Skeleton className='w-full h-8 rounded-md' />
              ) : (
                <div className='px-3 py-2 space-y-2'>
                  <Label className='text-xs font-semibold'>Election Rounds</Label>
                  <Select
                    defaultValue={selectedElectionRound?.id ?? ''}
                    onValueChange={(value) => {
                      const electionRound = electionRounds?.find((er) => er.id === value);
                      handleSelectElectionRound(electionRound);
                    }}>
                    <SelectTrigger className='w-full text-sm'>
                      <SelectValue placeholder='Select round' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Active & Upcoming</SelectLabel>
                        {activeElections?.map((electionRound) => (
                          <SelectItem key={electionRound.id} value={electionRound.id}>
                            <div className='flex items-center gap-2'>
                              {electionRound?.status === ElectionRoundStatus.NotStarted ? (
                                <PauseCircleIcon className='w-3 h-3' />
                              ) : null}
                              {electionRound?.status === ElectionRoundStatus.Started ? (
                                <PlayCircleIcon className='w-3 h-3' />
                              ) : null}
                              <span className='truncate'>{electionRound.title}</span>
                            </div>
                          </SelectItem>
                        ))}
                        <SelectSeparator />
                        <SelectLabel>Archived</SelectLabel>
                        {archivedElections?.map((electionRound) => (
                          <SelectItem key={electionRound.id} value={electionRound.id}>
                            <div className='flex items-center gap-2'>
                              <StopCircleIcon className='w-3 h-3' />
                              <span className='truncate'>{electionRound.title}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <LanguageSelector />
              <Disclosure.Button
                key='Sign Out'
                as={Button}
                onClick={() => {
                  signOut();
                  navigate({ to: '/login' });
                }}
                variant='ghost'
                className='w-full justify-start px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary'>
                Sign Out
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
