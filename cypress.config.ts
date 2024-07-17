import { defineConfig } from 'cypress'
import { spawn, fork } from 'child_process'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      process.env.IS_CYPRESS_TEST = 'true'

      on('task', {
        runToolA({ k, u, h }) {
          return new Promise((resolve, reject) => {
            const toolAPath = 'node_modules/@govtechsg/purple-hats'
            const backendProcessPath =
              // 'node_modules/@govtechsg/purple-hats/dist/combine.js'
              // 'node_modules/@govtechsg/purple-hats/dist/crawlers/runCustom.js'
              'node_modules/@govtechsg/purple-hats/dist/crawlers/custom/utils.js'
            // 'node_modules/@govtechsg/purple-hats/dist/crawlers/custom/waitForStartScan.js'

            // Fork the Tool A backend script with 'ipc' in stdio options
            const backendProcess = fork(`${backendProcessPath}`, [], {
              stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
            })

            backendProcess.on('error', (error) => {
              reject(new Error(`Error from Tool A Backend: ${error.message}`))
            })

            backendProcess.on('exit', (code) => {
              if (code !== 0) {
                reject(new Error(`Tool A Backend exited with code ${code}`))
              }
            })

            backendProcess.on('message', (message) => {
              // if (message === `scan-started and isCypressTest true`) {
              if (message === `scan-started`) {
                console.log(`Received ${message} from backend process`)

                resolve({ success: true })
              } else {
                console.log(`Received ${message} from backend process`)
                reject(new Error())
              }
            })

            // Spawn the Tool A CLI process
            const toolAProcess = spawn(
              'node',
              ['dist/cli.js', `-k ${k}`, `-c`, `3`, `-u ${u}`, `-h ${h}`],
              {
                cwd: toolAPath,
                shell: true,
              }
            )

            toolAProcess.stdout.on('data', (data) => {
              const stdoutMessage = data.toString().trim() // Convert Buffer to string
              console.log(`Purple A11y CLI stdout: ${data}`)

              if (stdoutMessage.includes('Overlay menu: successfully added')) {
                console.log(
                  'Cypress Received: Overlay menu: successfully added'
                )
                if (backendProcess.connected) {
                  // setTimeout(() => {
                  //   if (backendProcess.connected) {
                  //     backendProcess.send('start-scan')
                  //     console.log('Message sent to child process')
                  //   } else {
                  //     console.error('Backend process IPC channel closed')
                  //   }
                  // }, 5000)
                  backendProcess.send('start-scan')
                  console.log('Message sent to child process')
                } else {
                  console.error('Backend process IPC channel closed')
                }
              }
            })

            toolAProcess.stderr.on('data', (data) => {
              console.error(`Purple A11y CLI stderr: ${data}`)
            })

            toolAProcess.on('close', (code) => {
              console.log(`Purple A11y CLI process exited with code ${code}`)
              if (code === 0) {
                console.log('Tool A CLI process exited successfully')
                resolve({ success: true })
              } else {
                reject(
                  new Error(`Purple A11y CLI process exited with code ${code}`)
                )
              }
            })
          })
        },
      })

      return config
    },
    supportFile: 'dist/cypress/support/e2e.js',
    specPattern: 'dist/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
})
