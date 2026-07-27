'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { OverviewTab } from './OverviewTab';
import { MilestonesTab } from './MilestonesTab';
import { TimelineTab } from './TimelineTab';
import { ProgressTab } from './ProgressTab';
import { FilesTab } from './FilesTab';
import type { Project } from '../manager.actions';

const TABS = ['Overview', 'Milestones', 'Timeline', 'Updates', 'Files'] as const;
type TabType = typeof TABS[number];

export function ManagerProjectDetail({ project, files, updates }: { project: Project, files: any[], updates: any[] }) {
  const [activeTab, setActiveTab] = useState<TabType>('Overview');

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/[0.06]">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-[#4F7DFF] text-white'
                : 'border-transparent text-[#7A8499] hover:text-[#AAB3C5]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <Card variant="default" padding="lg">
        {activeTab === 'Overview' && <OverviewTab project={project} />}
        {activeTab === 'Milestones' && <MilestonesTab project={project} />}
        {activeTab === 'Timeline' && <TimelineTab project={project} />}
        {activeTab === 'Updates' && <ProgressTab project={project} updates={updates} />}
        {activeTab === 'Files' && <FilesTab project={project} files={files} />}
      </Card>
    </div>
  );
}
