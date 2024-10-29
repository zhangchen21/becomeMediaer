export async function getData(target: string) {			
  const res = await(await fetch('http://localhost:3000/random-docx?target=' + target)).json();
  if(res?.code === 0) {
    return res.data;
  }
  return {}
}