/*
 * Copyright (c) 2014-2023 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import path = require('path')
import { type Request, type Response, type NextFunction } from 'express'

const SAFE_KEY_NAME = /^[a-zA-Z0-9._-]+$/

module.exports = function serveKeyFiles () {
  return ({ params }: Request, res: Response, next: NextFunction) => {
    const basePath = path.resolve('encryptionkeys')
    const safeName = path.basename(String(params.file ?? ''))
    if (safeName.length === 0 || !SAFE_KEY_NAME.test(safeName)) {
      res.status(403)
      next(new Error('Invalid file name'))
      return
    }
    const resolvedPath = path.resolve(basePath, safeName)
    const relativePath = path.relative(basePath, resolvedPath)
    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
      res.status(403)
      next(new Error('Invalid path'))
      return
    }

    res.sendFile(resolvedPath)
  }
}
