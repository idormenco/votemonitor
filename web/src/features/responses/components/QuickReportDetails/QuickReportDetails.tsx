import { authApi } from '@/common/auth-api';
import { DateTimeFormat } from '@/common/formats';
import { usePrevSearch } from '@/common/prev-search-store';
import { QuickReportFollowUpStatus, type FunctionComponent, ElectionRoundStatus } from '@/common/types';
import { NavigateBack } from '@/components/NavigateBack/NavigateBack';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { useCurrentElectionRoundStore } from '@/context/election-round.store';
import { useElectionRoundDetails } from '@/features/election-event/hooks/election-event-hooks';
import { queryClient } from '@/main';
import { Route, quickReportDetailsQueryOptions } from '@/routes/responses/quick-reports/$quickReportId';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { Link, useRouter } from '@tanstack/react-router';
import { format } from 'date-fns';
import { quickReportKeys } from '../../hooks/quick-reports';
import { SubmissionType } from '../../models/common';
import { mapIncidentCategory, mapQuickReportFollowUpStatus, mapQuickReportLocationType } from '../../utils/helpers';
import { ResponseExtraDataSection } from '../ReponseExtraDataSection/ResponseExtraDataSection';

export default function QuickReportDetails(): FunctionComponent {
  const { quickReportId } = Route.useParams();
  const currentElectionRoundId = useCurrentElectionRoundStore((s) => s.currentElectionRoundId);
  const { data: electionRound } = useElectionRoundDetails(currentElectionRoundId);

  const quickReportQuery = useSuspenseQuery(quickReportDetailsQueryOptions(currentElectionRoundId, quickReportId));
  const quickReport = quickReportQuery.data;
  const { invalidate } = useRouter();

  const updateQuickReportFollowUpStatusMutation = useMutation({
    mutationFn: ({
      electionRoundId,
      followUpStatus,
    }: {
      electionRoundId: string;
      followUpStatus: QuickReportFollowUpStatus;
    }) => {
      return authApi.put<void>(`/election-rounds/${electionRoundId}/quick-reports/${quickReportId}:status`, {
        followUpStatus,
      });
    },

    onSuccess: (_data, { electionRoundId }) => {
      toast({
        title: 'Success',
        description: 'Follow-up status updated',
      });

      invalidate();
      void queryClient.invalidateQueries({ queryKey: quickReportKeys.all(electionRoundId) });
    },

    onError: () => {
      toast({
        title: 'Error updating follow up status',
        description: 'Please contact tech support',
        variant: 'destructive',
      });
    },
  });

  function handleFollowUpStatusChange(followUpStatus: QuickReportFollowUpStatus): void {
    updateQuickReportFollowUpStatusMutation.mutate({ electionRoundId: currentElectionRoundId, followUpStatus });
  }

  const prevSearch = usePrevSearch();

  return (
    <Layout
      backButton={<NavigateBack to='/responses' search={prevSearch} />}
      breadcrumbs={<></>}
      title={quickReport.id}>
      <div className='flex flex-col gap-3 max-w-4xl'>
        {/* Header Card - Compact Metadata */}
        <Card>
          <CardContent className='pt-4 pb-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
              <div>
                <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide'>Observer</p>
                <Link
                  className='text-sm font-medium text-accent hover:underline flex items-center gap-1'
                  to='/responses'
                  search={{ searchText: quickReport.monitoringObserverId, tab: 'quick-reports', viewBy: 'byEntry' }}
                  target='_blank'
                  preload={false}>
                  {quickReport.observerName}
                  <ArrowTopRightOnSquareIcon className='w-3.5 h-3.5' />
                </Link>
              </div>

              <div>
                <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide'>Submitted</p>
                <p className='text-sm'>
                  {quickReport.timestamp && format(quickReport.timestamp, DateTimeFormat)}
                </p>
              </div>

              <div>
                <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide'>Location type</p>
                <p className='text-sm'>{mapQuickReportLocationType(quickReport.quickReportLocationType)}</p>
              </div>

              <div>
                <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide'>Category</p>
                <p className='text-sm'>{mapIncidentCategory(quickReport.incidentCategory)}</p>
              </div>
            </div>

            {/* Location Details - Compact Grid */}
            {quickReport.level1 && (
              <div className='mt-3 pt-3 border-t border-border'>
                <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2'>Location Hierarchy</p>
                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-sm'>
                  <div>
                    <span className='text-xs text-muted-foreground'>L1:</span>
                    <p className='font-medium'>{quickReport.level1}</p>
                  </div>
                  {quickReport.level2 && (
                    <div>
                      <span className='text-xs text-muted-foreground'>L2:</span>
                      <p className='font-medium'>{quickReport.level2}</p>
                    </div>
                  )}
                  {quickReport.level3 && (
                    <div>
                      <span className='text-xs text-muted-foreground'>L3:</span>
                      <p className='font-medium'>{quickReport.level3}</p>
                    </div>
                  )}
                  {quickReport.level4 && (
                    <div>
                      <span className='text-xs text-muted-foreground'>L4:</span>
                      <p className='font-medium'>{quickReport.level4}</p>
                    </div>
                  )}
                  {quickReport.level5 && (
                    <div>
                      <span className='text-xs text-muted-foreground'>L5:</span>
                      <p className='font-medium'>{quickReport.level5}</p>
                    </div>
                  )}
                  {quickReport.number && (
                    <div>
                      <span className='text-xs text-muted-foreground'>No.:</span>
                      <p className='font-medium'>{quickReport.number}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {quickReport.pollingStationDetails && (
              <div className='mt-2'>
                <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1'>Station Details</p>
                <p className='text-sm'>{quickReport.pollingStationDetails}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Report Content Card */}
        <Card>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between gap-3'>
              <CardTitle className='text-lg'>Report Details</CardTitle>
              <Select
                onValueChange={handleFollowUpStatusChange}
                defaultValue={quickReport.followUpStatus}
                value={quickReport.followUpStatus}
                disabled={!quickReport.isOwnObserver || electionRound?.status === ElectionRoundStatus.Archived}>
                <SelectTrigger className='w-48'>
                  <SelectValue placeholder='Follow-up status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      key={QuickReportFollowUpStatus.NotApplicable}
                      value={QuickReportFollowUpStatus.NotApplicable}>
                      {mapQuickReportFollowUpStatus(QuickReportFollowUpStatus.NotApplicable)}
                    </SelectItem>
                    <SelectItem
                      key={QuickReportFollowUpStatus.NeedsFollowUp}
                      value={QuickReportFollowUpStatus.NeedsFollowUp}>
                      {mapQuickReportFollowUpStatus(QuickReportFollowUpStatus.NeedsFollowUp)}
                    </SelectItem>
                    <SelectItem key={QuickReportFollowUpStatus.Resolved} value={QuickReportFollowUpStatus.Resolved}>
                      {mapQuickReportFollowUpStatus(QuickReportFollowUpStatus.Resolved)}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Separator />
          </CardHeader>

          <CardContent className='flex flex-col gap-3'>
            <div>
              <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1'>Issue Title</p>
              <p className='text-sm font-medium'>{quickReport.title}</p>
            </div>

            <div>
              <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1'>Description</p>
              <p className='text-sm whitespace-pre-wrap'>{quickReport.description}</p>
            </div>

            {!!quickReport.attachments && quickReport.attachments.length > 0 && (
              <div className='mt-1'>
                <ResponseExtraDataSection
                  attachments={quickReport.attachments.map((a) => ({
                    ...a,
                    timeSubmitted: quickReport.timestamp,
                  }))}
                  notes={[]}
                  aggregateDisplay={false}
                  submissionType={SubmissionType.QuickReport}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
