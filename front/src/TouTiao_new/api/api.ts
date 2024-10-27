export async function getData() {			
  const res = await(await fetch('http://localhost:3000/random-docx')).json();
  if(res?.code === 0) {
    return res.data;
  }
  return {}
}