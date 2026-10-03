import { notFound } from 'next/navigation';
import { devToolsEnabled } from '../../lib/release';
import DevWorkbench from '../../components/content/DevWorkbench';
export default function DevPage(){
 if(!devToolsEnabled(process.env.NODE_ENV))notFound();
 return <DevWorkbench/>;
}
