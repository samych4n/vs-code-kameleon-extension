import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'

//const projectRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
const createFiles = (folder?: string) => {
  if (!folder)
    return vscode.window.showInformationMessage('Commando apenas para pasta')

  const stats = fs.statSync(folder)
  if (!stats.isDirectory())
    return vscode.window.showInformationMessage('Commando apenas para pasta')

  createStyled(folder)
  createType(folder)
  createVisual(folder)
  createComponent(folder)
  createIndex(folder)
  return vscode.window.showInformationMessage('Done')
}

const createStyled = (folder: string) => {
  const styledPath = path.join(folder, 'styled.ts')
  if (fs.existsSync(styledPath)) return

  const styledContent = `import styled from '@emotion/styled'
import { css } from '@emotion/react'

import { Theme } from 'newCheckout/types/Theme'

const wrapperStyles = ({ theme }:Theme) => css\`\`
export const Wrapper = styled('div')(wrapperStyles)
`

  fs.writeFileSync(styledPath, styledContent)
}

const createType = (folder: string) => {
  const typePath = path.join(folder, 'type.d.ts')
  if (fs.existsSync(typePath)) return

  const folderName = path.basename(folder)

  const typeContent = `export type ${folderName}Type = {}

export type ${folderName}VisualType = {}
`
  fs.writeFileSync(typePath, typeContent)
}

const createVisual = (folder: string) => {
  const typePath = path.join(folder, 'Visual.tsx')
  if (fs.existsSync(typePath)) return

  const folderName = path.basename(folder)

  const visualContent = `import * as S from './styled'
import { ${folderName}VisualType } from './type'

const ${folderName} = ({  }: ${folderName}VisualType) => (
  <S.Wrapper> SuccessVisual </S.Wrapper>
)

export default ${folderName}
`
  fs.writeFileSync(typePath, visualContent)
}

const createComponent = (folder: string) => {
	const folderName = path.basename(folder)
	const componentPath = path.join(folder, `${folderName}.tsx`)
	if (fs.existsSync(componentPath)) return

	const componentContent = `import { ${folderName}Type } from './type'
import Visual from './Visual'

const ${folderName} = ({  }: ${folderName}Type) => {
  return <Visual />
}

export default ${folderName}
`
	fs.writeFileSync(componentPath, componentContent)
}

const createIndex = (folder: string) => {
  const indexPath = path.join(folder, 'index.ts')
  if (fs.existsSync(indexPath)) return

  const folderName = path.basename(folder)

  const indexContent = `export * as ${folderName}Types from './type.d'
export { default as ${folderName} } from './${folderName}'
export { default as ${folderName}Visual } from './Visual'
`
  fs.writeFileSync(indexPath, indexContent)
}

export function activate (context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'kameleon.newComponent',
    (folder: vscode.Uri) => {
      const retorno = createFiles(folder?.fsPath)
    }
  )

  context.subscriptions.push(disposable)
}

export function deactivate () {}
