import { underPath } from '@/utils/methods'
import logger from '@/utils/logger'

logger.createLogger('prod')

async function main() {
    logger.prod.log('hey my girl')
}

main()
