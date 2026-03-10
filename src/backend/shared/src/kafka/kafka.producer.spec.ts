import { KafkaProducer } from './kafka.producer';

describe('KafkaProducer', () => {
    let producer: KafkaProducer;
    let mockKafkaService: Record<string, jest.Mock>;

    beforeEach(() => {
        mockKafkaService = {
            emit: jest.fn().mockResolvedValue(undefined),
        };
        producer = new KafkaProducer(mockKafkaService as never);
    });

    it('should be defined', () => {
        expect(producer).toBeDefined();
    });

    describe('send', () => {
        it('should send a string message to a topic', async () => {
            await producer.send('test-topic', 'hello');

            expect(mockKafkaService.emit).toHaveBeenCalledWith(
                'test-topic',
                'hello',
                undefined,
                undefined,
            );
        });

        it('should send an object message to a topic', async () => {
            const message = { type: 'test', data: { value: 1 } };
            await producer.send('test-topic', message);

            expect(mockKafkaService.emit).toHaveBeenCalledWith(
                'test-topic',
                message,
                undefined,
                undefined,
            );
        });

        it('should include key and headers when provided', async () => {
            await producer.send('test-topic', 'hello', 'key-1', { 'x-trace': 'abc' });

            expect(mockKafkaService.emit).toHaveBeenCalledWith(
                'test-topic',
                'hello',
                'key-1',
                { 'x-trace': 'abc' },
            );
        });
    });

    describe('sendBatch', () => {
        it('should send multiple messages to a topic', async () => {
            const messages = [
                { message: 'msg-1' },
                { message: 'msg-2', key: 'key-2' },
                { message: { data: 'msg-3' }, key: 'key-3', headers: { 'x-trace': 'abc' } },
            ];

            await producer.sendBatch('test-topic', messages);

            expect(mockKafkaService.emit).toHaveBeenCalledTimes(3);
        });

        it('should handle empty batch', async () => {
            await producer.sendBatch('test-topic', []);

            expect(mockKafkaService.emit).not.toHaveBeenCalled();
        });
    });
});
