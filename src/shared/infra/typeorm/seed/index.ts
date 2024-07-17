import { admin } from "./admin"
import { paises } from "./paises"
import { estados } from "./estados"
import { cidades } from "./cidades"
import { ceps } from "./ceps"
import { produtos } from "./produtos"

async function seeder() {
  await admin()
  await produtos()
  await paises()
  await estados()
  await cidades()
  await ceps()
}

seeder()
