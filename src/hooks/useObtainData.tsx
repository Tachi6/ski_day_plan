import { useEffect, useState } from 'react';
import { get, getDatabase, ref } from 'firebase/database';
import { app } from '../firebase/firebaseConfig';
import type { Lift, Run } from '../interfaces/interfacesRunLift';

type Status = 'idle' | 'loading' | 'success' | 'error';

export const useObtainData = (dbName?: string, specialTag?: string) => {
  const [runs, setRuns] = useState<Run[]>([]);
  const [lifts, setLifts] = useState<Lift[]>([]);
  const [allRuns, setAllRuns] = useState<Run[]>([]);
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    const obtainData = async () => {
      if (!dbName) return;

      setStatus('loading');

      try {
        const runsLiftsDB = ref(getDatabase(app), dbName);
        const snapshot = await get(runsLiftsDB);
        const data = snapshot.val();

        const loadedRuns: Run[] = data.runs;
        const loadedLifts: Lift[] = data.lifts;

        const filteredRuns = specialTag
          ? loadedRuns.filter((run) => run.ski_area_names.includes(specialTag))
          : loadedRuns;
        const filteredLifts = specialTag
          ? loadedLifts.filter((lift) => lift.ski_area_names.includes(specialTag))
          : loadedLifts;

        setRuns(filteredRuns.filter((run) => run.uses.includes('downhill')));
        setAllRuns(
          filteredRuns.filter(
            (run) => run.uses.includes('downhill') || run.uses.includes('connection'),
          ),
        );

        setLifts(filteredLifts);
        setStatus('success');
      } catch (_) {
        setStatus('error');
      }
    };

    obtainData();
  }, [dbName, specialTag]);

  return {
    runs,
    lifts,
    allRuns,
    status,
  };
};
