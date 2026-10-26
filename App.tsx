import { useEffect, useState } from 'react'

type Task = 'mate' | 'gallinas' | 'factura'

const tasks: { id: Task; label: string; place: string }[] = [
  { id: 'mate', label: 'Cebar unos mates', place: 'La cocina' },
  { id: 'gallinas', label: 'Alimentar a las gallinas', place: 'El gallinero' },
  { id: 'factura', label: 'Revisar la factura de luz', place: 'El buzón' },
]

const dialogue: Record<Task, string> = {
  mate: 'Amargo y lavado, como corresponde. +1 de energía.',
  gallinas: 'Las gallinas comen. Una no deja de mirar el piso.',
  factura: 'SEGUNDO AVISO. Vencimiento: ayer. Importe: mejor no mirar.',
}

function PixelTree({ className = '' }: { className?: string }) {
  return (
    <div className={`tree ${className}`} aria-hidden="true">
      <i /><i /><i /><b />
    </div>
  )
}

export default function App() {
  const [started, setStarted] = useState(false)
  const [scene, setScene] = useState(0)
  const [done, setDone] = useState<Task[]>([])
  const [message, setMessage] = useState('Otro martes tranquilo en Las Liebres.')
  const [night, setNight] = useState(false)
  const [door, setDoor] = useState(false)
  const [ending, setEnding] = useState(false)

  const complete = (id: Task) => {
    if (night) return
    if (!done.includes(id)) setDone((current) => [...current, id])
    setMessage(dialogue[id])
  }

  useEffect(() => {
    if (done.length !== 3 || night) return
    const timer = window.setTimeout(() => {
      setNight(true)
      setMessage('03:17 — Se cortó la luz. Algo golpea debajo del gallinero.')
    }, 900)
    return () => window.clearTimeout(timer)
  }, [done, night])

  if (!started && scene === 0) {
    return (
      <main className="title-screen">
        <div className="stars" />
        <section className="title-card">
          <p className="eyebrow">UNA HISTORIA RURAL DE TERROR</p>
          <h1>IN THE MIDDLE<br /><span>OF THE RANCHO</span></h1>
          <div className="title-landscape">
            <div className="moon" />
            <div className="windmill"><i /><b /></div>
            <div className="house-mini"><i /><b /></div>
          </div>
          <p className="year">PROVINCIA DE BUENOS AIRES · 2007</p>
          <button className="start-button" onClick={() => setScene(1)}>EMPEZAR PARTIDA</button>
          <p className="hint">Un prólogo jugable · sonido recomendado</p>
        </section>
      </main>
    )
  }

  if (!started) {
    const lines = [
      ['07:31 · COCINA DEL RANCHO', 'La pava silba desde hace rato. Afuera, el viento empuja la tierra contra las chapas.'],
      ['TÍO RUBÉN', 'Te digo que si el cinco no me pegaba de atrás, hoy estaba jugando en Primera.'],
      ['VOS', 'Ajá... ¿querés otro mate?'],
    ]
    return (
      <main className={`cinematic shot-${scene}`}>
        <div className="cinema-grain" />
        <div className="cinema-room">
          <div className="cinema-window"><i /><b /></div>
          <div className="shelf"><i /><i /><i /></div>
          <div className="calendar"><b>16</b><span>OCT 2007</span></div>
          <div className="table">
            <div className="kettle" />
            <div className="mate"><i /><b className="steam s1" /><b className="steam s2" /></div>
          </div>
          <div className="cinema-person hero"><i className="hair" /><i className="face" /><b className="torso" /><span className="arm" /></div>
          <div className="cinema-person uncle"><i className="hair" /><i className="face" /><b className="torso" /><span className="arm" /></div>
          <div className="radio"><i /><b /> FM 92.7</div>
        </div>
        <div className="letterbox top" />
        <div className="letterbox bottom" />
        <section className="subtitle">
          <strong>{lines[scene - 1][0]}</strong>
          <p>{lines[scene - 1][1]}</p>
          <button onClick={() => scene < 3 ? setScene(scene + 1) : setStarted(true)}>
            {scene < 3 ? 'CONTINUAR ›' : 'SALIR AL PATIO ›'}
          </button>
        </section>
        <button className="skip" onClick={() => setStarted(true)}>SALTAR CINEMÁTICA</button>
      </main>
    )
  }

  return (
    <main className={`game ${night ? 'is-night' : ''} ${ending ? 'is-ending' : ''}`}>
      <header className="hud">
        <div>
          <strong>{night ? '03:17' : '07:42'}</strong>
          <span>MARTES · 16 OCT 2007</span>
        </div>
        <div className="location"><i /> LAS LIEBRES, BS. AS.</div>
      </header>

      <section className="world" aria-label="El rancho">
        <div className="sky">
          <div className="sun" />
          <div className="cloud cloud-one" />
          <div className="cloud cloud-two" />
        </div>
        <PixelTree className="tree-one" />
        <PixelTree className="tree-two" />
        <div className="silo"><i /><b /></div>
        <div className="house">
          <div className="roof" />
          <div className="wall">
            <div className="window"><i /></div>
            <div className="house-door" />
          </div>
          <button className="hotspot kitchen" onClick={() => complete('mate')}>
            <span>Cocina</span>
          </button>
        </div>
        <div className="fence" />
        <button className="mailbox hotspot" onClick={() => complete('factura')}>
          <i /><b /><span>Buzón</span>
        </button>
        <div className="coop">
          <div className="coop-roof" />
          <div className="coop-body"><i className="chicken">●</i></div>
          <button className="hotspot coop-action" onClick={() => {
            if (night) {
              setDoor(true)
              setMessage('«NO BAJES. NO IMPORTA LO QUE ESCUCHES»')
            } else complete('gallinas')
          }}><span>{night ? 'Investigar' : 'Gallinero'}</span></button>
        </div>
        <div className={`metal-door ${door ? 'revealed' : ''}`}>
          <div className="warning">NO BAJES</div>
          <button onClick={() => setEnding(true)}>BAJAR DE TODAS FORMAS</button>
        </div>
        <div className="character">
          <div className="hat" /><div className="head" /><div className="body" /><div className="legs" />
        </div>
        <div className="grass-lines" />
      </section>

      <aside className="task-panel">
        <p>COSAS PARA HOY</p>
        {tasks.map((task) => (
          <div key={task.id} className={done.includes(task.id) ? 'done' : ''}>
            <i>{done.includes(task.id) ? '×' : ''}</i>
            <span>{task.label}<small>{task.place}</small></span>
          </div>
        ))}
      </aside>

      <div className="dialogue">
        <div className="portrait"><i /><b /></div>
        <p><strong>VOS</strong>{message}</p>
      </div>

      {ending && (
        <section className="ending">
          <div className="photo">
            <div className="photo-scene"><span className="you">♟</span><span className="double">♟</span></div>
            <p>MAÑANA · 03:17</p>
          </div>
          <div>
            <p className="eyebrow">FIN DEL PRÓLOGO</p>
            <h2>La foto todavía está húmeda.</h2>
            <p>Detrás tuyo, algo respira con tu misma voz.</p>
            <button onClick={() => window.location.reload()}>VOLVER A EMPEZAR</button>
          </div>
        </section>
      )}
    </main>
  )
}
