'use client';

import { useEffect, useState } from 'react';
import { loadComponentBenchmarkComparison, type ComponentBenchmarkComparison } from '@/lib/component-benchmarks';
import { BenchmarkScoreComparison } from './BenchmarkScoreComparison';

export function BenchmarkScoreComparisonLoader({ partIds, title }: { partIds: Array<number | string>; title?: string }) {
  const [data, setData] = useState<ComponentBenchmarkComparison>({ selectedPartId: null, parts: [], items: [], total: 0, reason: '벤치마크 데이터를 불러오는 중입니다.' });

  useEffect(() => {
    let cancelled = false;
    void loadComponentBenchmarkComparison(partIds).then((next) => {
      if (!cancelled) setData(next);
    });
    return () => { cancelled = true; };
  }, [partIds.join(',')]);

  return <BenchmarkScoreComparison data={data} title={title} />;
}
